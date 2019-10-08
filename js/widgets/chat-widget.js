class ChatWidget {
    constructor() {
    }

    init() {
        var context = this;
        console.log("ChatWidget");

        var tags = [{
            type: "input",
            tag: "text",
            name: "name",
            "chat-msg": "Hi, I'm Dynamiko. What's your name?"
        },
        {
            type: "input",
            tag: "radio",
            name: "color",
            "chat-msg": "Nice to meet ya, {{name}}! Pick a color!",
            children: [{
                value: "red",
                text: "Red",
            },
            {
                value: "blue",
                text: "Blue",
            },
            {
                value: "green",
                text: "Green",
            }
            ]
        },
        {
            type: "msg",
            "chat-msg": "You know, Voldemort's favorite color was also {{color}}...",
            delay: 1250,
            callback: function () {
                var name = Chat.getData().name;
                Chat.addTags([{
                    type: "input",
                    tag: "radio",
                    name: "tricked",
                    "chat-msg": "What's your REAL name???",
                    children: [{
                        value: true,
                        text: "Lord Voldemort"
                    },
                    {
                        value: false,
                        text: name
                    },
                    {
                        value: true,
                        text: "Mr. V-Mort"
                    }
                    ],
                    success: function (data) {
                        var msg = data.tricked == 'true' ? "No chatbot for you, Mr. Voldemort!" : "Oh... I guess {{color}} isn't just for evil wizards!";

                        Chat.addTags([{
                            type: "msg",
                            "chat-msg": msg,
                            delay: 2000
                        }]);
                    }
                }])
            }
        },
        {
            type: "input",
            tag: "custom",
            name: "customTag",
            submitBarStyle: 'full-submit',
            "chat-msg": "This is a basic custom tag. This one doesn't do much, but there is so much potential!",
            renderer: context.customTagRender,
            retriever: function () {
                $('#custom-input').remove();
                return {
                    data: window.customData,
                    friendly: "Custom inputs can return data, and a custom message to display from the user. That is what this message is."
                }
            }
        },
        {
            type: "msg",
            "chat-msg": "Anyways, thanks for checking this out! There are more demos and docs on the <a href='https://github.com/WiFuchs/chatty'>Github repo</a>"
        }
        ];

        Chat.start($('#mychat-context'), tags);
    }

    customTagRender() {
        $('#ui-control').prepend('<div id="custom-input">Custom input! Practically, this would be a clickable map or image, or virtually anything that you can code up. Click the big button below to submit</div>');

        //This custom data would be set by user interaction in the real world
        window.customData = "the possibilities are endless!";
    }
}
