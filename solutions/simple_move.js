{
    init: function(elevators, floors) {
        /* A simple escalator
         * that moves one floor up and down
         * without considering users.
         */
        const UP = 1;
        const DOWN = -1;
        const BOT_FLOOR = 0;
        const TOP_FLOOR = floors.length - 1;

        var elevator = elevators[0];
        var direction = UP;

        elevator.on("idle", function() {

            const current = elevator.currentFloor();
            const next = current + direction;

            if (next > TOP_FLOOR || next < BOT_FLOOR) {
                direction *= -1;
                elevator.goToFloor(current + direction);
                return;
            }

            elevator.goToFloor(next);
        });
    },
    update: function(dt, elevators, floors) {}
}
