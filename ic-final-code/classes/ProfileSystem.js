// Profile system temporarily disabled...

// /**
//  * 角色档案系统
//  * 管理玩家角色Ligeia的信息、游戏数据和成就
//  */
// class ProfileSystem {
//     constructor() {
//         // Ligeia的基本信息
//         this.playerInfo = {
//             name: "Ligeia",
//             title: "The Lady of the North Farm",
//             background: [
//                 "She chose to settle in this frontier town, in the northern reaches of the kingdom.",
//                 "None in the village know much about their mysterious neighbor, though her crops grow more vibrant than any they've seen.",
//                 "While the townspeople have grown used to her ways, some still speak of strange lights that flicker across her fields under the moonlight."
//             ].join('\n'),
            
//             // 小镇见闻录（通过游戏进度解锁）
//             unlockedLore: new Map([
//                 ['tavern_rumors', "Down at the forge, the apprentice claims he saw turnips leap from the earth of their own accord, as though plucked by ghostly hands. The old blacksmith merely smiles into his tankard of ale."],
//                 ['market_tales', "'Never seen produce quite like this,' old Tom mutters at the marketplace, adding a few more coppers to his prices. 'Fresh as the day they were picked, even after months.'"],
//                 ['church_records', "Posted upon the church door: 'Seeking wise men of learning to study peculiar occurrences at the northern farm. Generous reward offered.' Yet none have found answers."],
//                 ['hunters_diary', "From Clyde the Hunter's journal: 'That mist rolled in again tonight. Saw shapes moving where they shouldn't be, but strange... my hounds paid them no mind at all.'"]
//             ]),

//             stats: new CharacterStats()
//         };
        
//     }


//     // Not done yet I just put some placeholder here...
//     display() {
//         if (!this.isVisible) return;
        
//         this.displayBasicInfo();
//         this.displayStatistics();
//         this.displayNPCRelations();
//         this.displayAchievements();
//         this.displayLore();
//     }

    
//     toggleDisplay() {
//         this.isVisible = !this.isVisible;
//     }
// } 


class ProfileSystem {
    constructor() {
        // Only keep the most basic player information
        this.playerInfo = {
            name: "Ligeia",
            title: "The Lady of the North Farm"
        };
        
        this.statistics = {
            daysPlayed: 0,
            cropsHarvested: 0
        };
        
        this.isVisible = false;
    }

    updateStatistics(key, value) {
        if (this.statistics.hasOwnProperty(key)) {
            this.statistics[key] += value;
        }
    }

    display() {

    }
}