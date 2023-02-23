let instance: EventDispatcher

export default class EventDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super()
    }

    static getInstance() {
        if (typeof instance == "undefined") {
            instance = new EventDispatcher()
        }
        return instance
    }
}