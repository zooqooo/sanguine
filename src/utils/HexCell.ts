import Button from "../components/general_components/Button"

type buttonStyle = {
    x:  number,
    y: number,
    spriteKey: string,
    clickSound?: { key: string, music: boolean, loop: boolean, volume: number },
    hoverSound?: { key: string, music: boolean, loop: boolean, volume: number },
    scale?: number,
    text?: string,
    textStyle?: Phaser.Types.GameObjects.Text.TextStyle,
    textOffset?: number,
    dropShadow? : boolean,
    pixelPerfect? : boolean
}

type triplePoint = {
    q: number,
    r: number,
    s: number
}

export class Point
{
    constructor (public x:number, public y:number) {}
}

export class Orientation
{
    constructor (public f0:number, public f1:number, public f2:number, public f3:number, public b0:number, public b1:number, public b2:number, public b3:number, public start_angle:number) {}
}

export class Layout
{
    constructor (public orientation:Orientation, public size:Point, public origin:Point) {}
    public static pointy:Orientation = new Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5)
    public static flat:Orientation = new Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0)

    public hexToPixel(h:HexCell):Point
    {
        var M:Orientation = this.orientation
        var size:Point = this.size
        var origin:Point = this.origin
        var x:number = (M.f0 * h.q + M.f1 * h.r) * size.x
        var y:number = (M.f2 * h.q + M.f3 * h.r) * size.y
        return new Point(x + origin.x, y + origin.y)
    }


    public pixelToHex(p:Point):HexCell
    {
        var M:Orientation = this.orientation
        var size:Point = this.size
        var origin:Point = this.origin
        var pt:Point = new Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y)
        var q:number = M.b0 * pt.x + M.b1 * pt.y
        var r:number = M.b2 * pt.x + M.b3 * pt.y
        return new HexCell(q, r, -q - r)
    }


    public hexCornerOffset(corner:number):Point
    {
        var M:Orientation = this.orientation
        var size:Point = this.size
        var angle:number = 2.0 * Math.PI * (M.start_angle - corner) / 6.0
        return new Point(size.x * Math.cos(angle), size.y * Math.sin(angle))
    }


    public polygonCorners(h:HexCell):Point[]
    {
        var corners:Point[] = []
        var center:Point = this.hexToPixel(h)
        for (var i = 0; i < 6; i++)
        {
            var offset:Point = this.hexCornerOffset(i)
            corners.push(new Point(center.x + offset.x, center.y + offset.y))
        }
        return corners
    }

}


export default class HexCell {
    constructor(public q: number, public r: number, public s: number ) {
        if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0"
    }

    public getTriplePoint() : string {
        return `${this.q}${this.r}${this.s}`
    }

    public add(b:HexCell) : HexCell {
        return new HexCell(this.q + b.q, this.r + b.r, this.s + b.s)
    }

    public cubeScale(factor: number) : HexCell {
        return new HexCell(this.q * factor, this.r * factor, this.s * factor)
    }

    public cubeRing(radius: number) : HexCell[] {
        let results = []
        let hex = this.distantNeighbor(4, radius)
        for (let i = 0; i < 6; i++ ) {
            for ( let j = 0; j < radius; j++ ) { 
                results.push(hex)
                hex = hex.neighbor(i)
            }
        }                
        return results
    }

    public cubeSpiral(radius: number) : HexCell[] {
        let results: HexCell[] = [this]
        for (let i = 1; i <= radius; i++) {
            results = results.concat(this.cubeRing(i))
        }
        return results
    }

    public subtract(b : HexCell) : HexCell {
        return new HexCell(this.q - b.q, this.r - b.r, this.s - b.s)
    }

    public scale(k : number) : HexCell {
        return new HexCell(this.q * k, this.r * k, this.s * k)
    }

    public rotateLeft() : HexCell {
        return new HexCell(-this.s, -this.q, -this.r)
    }

    public rotateRight() : HexCell {
        return new HexCell(-this.r, -this.s, -this.q)
    }

    public static directions : HexCell[] = [new HexCell(1, 0, -1), new HexCell(1, -1, 0), new HexCell(0, -1, 1), new HexCell(-1, 0, 1), new HexCell(-1, 1, 0), new HexCell(0, 1, -1)]

    public static direction(direction : number) : HexCell {
        return HexCell.directions[direction]
    }

    public neighbor(direction : number) : HexCell {
        return this.add(HexCell.direction(direction))
    }

    public distantNeighbor(direction: number, distance: number ) : HexCell {
        if (distance == 1) return this.add(HexCell.direction(direction))
        return this.add(HexCell.direction(direction)).distantNeighbor(direction, distance-1)
    }

    public static diagonals : HexCell[] = [new HexCell(2, -1, -1), new HexCell(1, -2, 1), new HexCell(-1, -1, 2), new HexCell(-2, 1, 1), new HexCell(-1, 2, -1), new HexCell(1, 1, -2)]

    public diagonalNeighbor(direction : number) : HexCell {
        return this.add(HexCell.diagonals[direction])
    }

    public len() : number {
        return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2
    }

    public distance(b : HexCell) : number {
        return this.subtract(b).len()
    }

    public round() : HexCell {
        var qi : number = Math.round(this.q)
        var ri : number = Math.round(this.r)
        var si : number = Math.round(this.s)
        var q_diff : number = Math.abs(qi - this.q)
        var r_diff : number = Math.abs(ri - this.r)
        var s_diff : number = Math.abs(si - this.s)
        if (q_diff > r_diff && q_diff > s_diff)
        {
            qi = -ri - si
        }
        else
            if (r_diff > s_diff)
            {
                ri = -qi - si
            }
            else
            {
                si = -qi - ri
            }
        return new HexCell(qi, ri, si)
    }

    public lerp(b : HexCell, t : number) : HexCell {
        return new HexCell(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t)
    }

    public linedraw(b : HexCell) : HexCell[] {
        var N : number = this.distance(b)
        var a_nudge : HexCell = new HexCell(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06)
        var b_nudge : HexCell = new HexCell(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06)
        var results : HexCell[] = []
        var step : number = 1.0 / Math.max(N, 1)
        for (var i = 0; i <= N; i++)
        {
            results.push(a_nudge.lerp(b_nudge, step * i).round())
        }
        return results
    }
}