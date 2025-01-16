const TaskConfigs = {
    // only keep tasks matching current system
    'collect_wheat': {
        id: 'collect_wheat',
        description: 'Get 1 wheat',
        requirements: {
            item: 'wheat',
            amount: 1
        },
        reward: {
            gold: 200,
            relationship: 2
        }
    },
    'collect_corn': {
        id: 'collect_corn',
        description: 'Get 1 corn',
        requirements: {
            item: 'corn',
            amount: 1
        },
        reward: {
            gold: 180,
            relationship: 2
        }
    },
    'collect_beetroot': {
        id: 'collect_beetroot',
        description: 'Get 1 beetroot',
        requirements: {
            item: 'beetroot',
            amount: 1
        },
        reward: {
            gold: 160,
            relationship: 1
        }
    }
}; 