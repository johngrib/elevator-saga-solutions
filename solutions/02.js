{
    init: function(elevators, floors) {

        const UP = 'up';
        const DOWN = 'down';
        const LIMIT = 0.8;
        const BOT_FLOOR = 0;
        const TOP_FLOOR = floors.length - 1;

        floors.forEach(function(floor) {
            floor._is = {
                up: () => floor.buttonStates.up !== "",
                down: () => floor.buttonStates.down !== "",
                requested: () => floor._is.up() || floor._is.down(),
                edge: () =>
                    (floor.floorNum() == BOT_FLOOR) || (floor.floorNum() == TOP_FLOOR),
                wait: (dir) =>
                    floor._is.edge() ? floor._is.requested() : floor._is[dir](),
            }
        });

        elevators.forEach(function(elevator) {

            elevator._is = {
                will_stop: function(level) {
                    return elevator.destinationQueue
                        .indexOf(level) > -1;
                },
                full: function() {
                    return elevator.loadFactor() > LIMIT
                },
            };

            elevator._check_visited = function(level) {
                this.destinationQueue.splice(
                    this.destinationQueue.indexOf(level), 1);
            }

            /* 엘리베이터 안에서 level 층 버튼을 눌렀을 때 */
            elevator.on("floor_button_pressed", function(level) {
                if (this._is.will_stop(level)) {
                    return;
                }
                this.goToFloor(level);
            });

            /* 엘리베이터가 level 층을 곧 지나가기 전에 할 일들 */
            elevator.on("passing_floor", function(level, direction) {
                const floor = floors[level];

                if (!this._is.full() && floor._is.wait(direction)) {
                    this.goToFloor(level, true);
                    return;
                }

                if (this._is.will_stop(level)) {
                    this._check_visited(level);
                    this.goToFloor(level, true);
                    return;
                }
            });

            /* 엘리베이터가 놀고 있을 때 할 일 */
            elevator.on("idle", function() {
                const waitFloors = floors.filter(function(floor) {
                    return floor._is.requested();
                });

                if (waitFloors.length < 1) {
                    elevator.goToFloor(BOT_FLOOR);
                    return;
                }

                const tempLevel = waitFloors[0].floorNum();
                if (waitFloors.length == 1) {
                    elevator.goToFloor(tempLevel);
                    return;
                }

                const currentLevel = this.currentFloor();
                const closest = {
                    level: tempLevel,
                    dist: Math.abs(tempLevel - currentLevel),
                }

                waitFloors.forEach(function(floor) {
                    const dist = Math.abs(floor.floorNum() - currentLevel);
                    if (dist < closest.dist) {
                        closest.level = floor.floorNum();
                        closest.dist = dist;
                    }
                });

                this.goToFloor(closest.level);
            })
        });
    },
    update: function(dt, elevators, floors) {}
}
