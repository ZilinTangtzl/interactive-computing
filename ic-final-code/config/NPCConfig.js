const NPCConfigs = {
    'blacksmith': {
        id: 'blacksmith',
        name: 'Smith',
        title: 'Blacksmith',
        position: { x: 400, y: 300 },
        sprite: null,  // 稍后在preload()中加载

        scheduleData: {
            '06:00': { activity: 'open_shop', location: 'blacksmith_shop' },
            '12:00': { activity: 'lunch', location: 'tavern' },
            '13:00': { activity: 'work', location: 'blacksmith_shop' },
            '20:00': { activity: 'close_shop', location: 'home' }
        },

        dialogues: {
            greeting: {
                morning: {
                    first: [
                        "Morning! Just lit the forge.",
                        "Early bird! Try this new scythe?"
                    ],
                    repeat: [
                        "Back again? Tools working well?",
                        "Need repairs? Fire's hot."
                    ]
                },
                afternoon: {
                    first: [
                        "Hey! Got new tools ready.",
                        "Perfect timing! Want to see new stock?"
                    ],
                    repeat: [
                        "Need help with tools?",
                        "Farm going well? I'm here if tools break."
                    ]
                },
                evening: {
                    first: [
                        "Evening! Done for today.",
                        "Still working? Tool problems?"
                    ],
                    repeat: [
                        "It's late. Come back tomorrow.",
                        "About to close. Urgent?"
                    ]
                }
            },

            shop: [
                "Check these new tools. Built to last.",
                "Got fresh stock. Take a look?"
            ],

            task: [
                "Need a favor...",
                "Busy times. Help me out?",
                "You're good. Gather stuff for me?"
            ]
        },

        canGiveTasks: true,
        taskDialogues: {
            available: "Got work for you...",
            inProgress: "How's it going?",
            completed: "Well done, thanks."
        },
        availableTasks: ['collect_wheat', 'collect_corn','collect_beetroot']
    }
}; 
