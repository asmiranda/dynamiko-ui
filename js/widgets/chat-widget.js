class ChatWidget {
    constructor() {
    }

    init() {
        var context = this;
        console.log("ChatWidget");

        var tags = [
            {
                type: "input",
                tag: "text",
                "chat-msg": "Hello, World! What is your name?",
                name: "name",
                placeholder: "Snazzy McChatbot"
            },
            {
                type: "msg",
                "chat-msg": "Nice to meet you, {{name}}! Welcome to Chatty"
            }
        ];
        Chat.start($('#chat-context'), tags);
    }
}
