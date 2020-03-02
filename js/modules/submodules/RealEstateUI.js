class RealEstateUI { 
    constructor() {
        this.lastGeoResult;
    }

    loadLastSelectedRealEstate() {
        if (localStorage.latestRealEstateId>0) {
            realEstateUI.loadRealEstateProfile(localStorage.latestRealEstateId);
            realEstateUI.loadSelectedRealEstateMap(localStorage.latestRealEstateId);
        }
    }

    loadSelectedRealEstateMap(recordId) {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateUI/getRealEstate/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            realEstateUI.arrangeSelectedRealEstateMap(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSelectedRealEstateMap(data) {
        var strMap = "realEstateMapDashboard"
        document.getElementById('realEstateMapHolder').innerHTML = `<div id='${strMap}' style='width: 100%; height: 100%;'></div>`;
        var geocodeService = L.esri.Geocoding.geocodeService();

        var latlng = new L.LatLng(data.getProp("latitude"), data.getProp("longitude"));
        var myMap = L.map(strMap).setView(latlng, 13);

        var marker = function (error, result) {
            if (error) {
                return;
            }
            console.log(result.address.Match_addr);
            realEstateUI.lastGeoResult = result;
            var str = `
                <div style="min-width: 300px; padding-bottom: 10px;">
                    <span>${result.address.Match_addr}</span><br/>
                    <a href="#" class="pull-right btnUpdateRealEstateLocation" recordId="${localStorage.latestRealEstateId}"><i class="fa fa-pencil"></i> Update&nbsp;Location</a>
                </div>
            `;
            L.marker(result.latlng).addTo(myMap).bindPopup(str).openPopup();
        };

        var mapClicked = function(e) {
            geocodeService.reverse().latlng(e.latlng).run(marker);                  
        }        
        myMap.on('click', mapClicked);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);
        L.Control.geocoder().addTo(myMap);
        geocodeService.reverse().latlng(latlng).run(marker);                  
    }

    updateRealEstateLocation(obj) {
        var recordId = $(obj).attr("recordId");
        console.log("RECORD ID == "+recordId);
        console.log(realEstateUI.lastGeoResult);

        var tmp = {};
        tmp["recordId"] = recordId;
        tmp["location"] = realEstateUI.lastGeoResult;
        
        var vdata = JSON.stringify(tmp);

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateUI/post/updateRealEstateLocation`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    loadRealEstateProfile(recordId) {
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateUI/getRealEstateProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log(data);
            var RealEstateName = data.getProp("firstName")+" "+data.getProp("lastName");
            var job = data.getProp("specialization");
            var email = data.getProp("email");
            var contact = data.getProp("contact");

            $(".RealEstateUI_RealEstateName").html(RealEstateName);    
            $(".RealEstateUI_RealEstate_Job").html(job);    
            $(".RealEstateUI_RealEstate_Email").html(email);    
            $(".RealEstateUI_RealEstate_Contact").html(contact);   
            $(".RealEstateUI_ProfilePic").attr("src", `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/profilePic/RealEstateUI/${recordId}`);   
            $(".RealEstateUI_ProfilePic").attr("recordId", recordId);   
            $(".RealEstateUI_ProfilePic").show();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    selectRealEstate(obj) {
        var recordId = $(obj).attr("recordId");
        localStorage.latestRealEstateId = recordId;
        var tabName = $(obj).attr("tabName");
        console.log(tabName);

        if (tabName=="dashboard") {
            realEstateUI.loadRealEstateProfile(recordId);
            realEstateUI.loadSelectedRealEstateMap(recordId);
        }
    }

    searchRealEstateFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateUI/filterRealEstate/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            RealEstateUI.arrangeSearchedRealEstates(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopRealEstate() {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/RealEstateUI/getTopRealEstates`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successCallback = function(data) {
            realEstateUI.arrangeSearchedRealEstates(data, "dashboard");
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedRealEstates(data, tabName) {
        console.log(data);
        var divName = `.searchRealEstates[module="RealEstateUI"][tabName="${tabName}"]`;
        $(divName).empty();
        $(data).each(function(index, obj) {
            var RealEstateName = obj.getProp("streetNumber")+" "+obj.getProp("streetName");
            var zipCode = obj.getPropDefault("zipCode", "");
            var companyName = obj.getPropDefault("companyName", "");
            var hqAddress = obj.getPropDefault("hqAddress", "");
            var email = obj.getPropDefault("email", "");
            var citizenName = obj.getPropDefault("citizenName", "");
            var realEstateId = obj.getProp("realEstateId");
            var latitude = obj.getProp("latitude");
            var longitude = obj.getProp("longitude");
            var str = `
                <div style="display: flex; flex-wrap: wrap;">
                    <div style="flex: 50%;">
                        <span><a href="#" class="RealEstateUI_selectRealEstate" recordId="${realEstateId}" module="RealEstateUI" tabName="${tabName}">${RealEstateName}</a></span>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted pull-right"><i class="fa fa-home"></i> ${zipCode}</small>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted"><i class="fa fa-compass"> Lat: </i> ${latitude}</small>
                    </div>
                    <div style="flex: 50%">
                        <small class="text-muted pull-right"><i class="fa fa-compass"> Long: </i> ${longitude}</small>
                    </div>
                    <div style="flex: 50%">
                        <span class="text-muted">Company: ${companyName}</span>
                    </div>
                    <div style="flex: 50%">
                        <span class="text-muted pull-right">HQ: ${hqAddress}</span>
                    </div>
                    <div style="flex: 50%">
                        <span class="text-muted">Contact: ${citizenName}</span>
                    </div>
                    <div style="flex: 50%">
                        <span class="text-muted pull-right">${email}</span>
                    </div>
                </div>
                <hr style="margin-top: 5px; width: 98%">
            `;
            // var str = `
            //     <a href="#" class="RealEstateSelect" module="RealEstateUI" tabName="${tabName}" recordId="${recordId}" style="font-weight: bolder;">${RealEstateName}</a>
            //     <span class="text-muted">
            //         ${zipCode}
            //     </span>
            //     <hr>
            // `;
            $(divName).append(str);            
        });
    }
}

