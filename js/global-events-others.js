class GlobalEventsOthers {
    initializeGlobalEvents() {
        $(document).on('keyup', '.searchProductFilter[module="ProductUI"]', function() {
            productUI.searchProductFilter(this);
        });

        $(document).on('click', '.teamMemberSelect[module="EmployeeTeamMemberUI"]', function() {
            employeeTeamMemberUI.selectTeamMember(this);
        });

        $(document).on('click', '.PersonTaskUI_btnShowAddTask', function() {
            personTaskUI.showAddTask(this);
        });
        $(document).on('click', '.PersonTaskUI_btnShowUpdateTask', function() {
            personTaskUI.showUpdateTask(this);
        });
        $(document).on('click', '.PersonTaskUI_btnAddTaskNew', function() {
            personTaskUI.saveTask(this, "NEW");
        });
        $(document).on('click', '.PersonTaskUI_btnAddTaskClose', function() {
            personTaskUI.saveTask(this, "CLOSE");
        });
        $(document).on('click', '.PersonTaskUI_btnDeleteTask', function() {
            personTaskUI.deleteTask(this);
        });
    }
}
