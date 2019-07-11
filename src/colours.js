export class ColourRotator {
    constructor(colours) {
        this.colours = colours;
        this.i = 0;
    }

    getColour() {
        const colour = this.colours[this.i % this.colours.length];
        this.i++;
        return colour;
    }
}

export class Lava extends ColourRotator{
    constructor(){
        super([
            '#D00E14',
            '#06AED5',
            '#086788',
            '#F0C808',
            '#FFF1D0'
        ])
    }
}
