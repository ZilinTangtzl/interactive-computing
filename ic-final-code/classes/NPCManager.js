class NPCManager {
    constructor() {
        this.npcs = new Map();
        this.loadNPCs();
        this.lastInteractionTime = 0;
        this.interactionCooldown = 1000;
        this.lastInteractedNPC = null;
    }

    loadNPCs() {
        for (let npcId in NPCConfigs) {
            let npcData = NPCConfigs[npcId];
            let npc = new NPC(npcData);
            this.npcs.set(npcId, npc);
        }
    }

    update() {
        this.npcs.forEach(function(npc) {
            npc.update();
            npc.display();
        });
    }

    checkInteractions(player) {
        let currentTime = millis();
        if (currentTime - this.lastInteractionTime < this.interactionCooldown) {
            return;
        }

        let foundNearbyNPC = false;
        
        this.npcs.forEach((npc) => {
            if (npc.isNearPlayer(player)) {
                foundNearbyNPC = true;
                if (!player.dialogBox.isVisible) {
                    npc.interact(player);
                    this.lastInteractionTime = currentTime;
                    this.lastInteractedNPC = npc;
                }
            }
        });

        if (!foundNearbyNPC && this.lastInteractedNPC) {
            player.dialogBox.hide();
            this.lastInteractedNPC = null;
            player.npc = null;
        }
    }
}