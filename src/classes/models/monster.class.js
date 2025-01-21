class Monster {
    constructor(monsterId, monsterNumber, level) {
        this.monsterId = monsterId;
        this.monsterNumber = monsterNumber;
        this.level = level;
        this.x = 0;
        this.y = 0;
    }

    setHp(hp, maxHp) {
        this.hp = hp;
        this.maxHp = maxHp;
    }

    //레이턴시에 따라서 추측항법을 해야 하는가
    movePosition(latency) {
        //레이턴시에 따라서 이동을 해보도록 하자.
    }

    monsterDamaged(damage) {
        this.hp -= damage;
    }


    monsterDie() {

    }

    update() {
        if (this.hp < 0) {
            this.monsterDie();
        }
    }
}