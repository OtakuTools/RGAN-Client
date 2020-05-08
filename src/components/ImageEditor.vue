<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <canvas id="imageEditor" style="border:1px solid black;" width="400" height="300"></canvas>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-menu
          :v-model="picker.pen"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn depressed color="white" v-on="on" @click="handleMode('pen')" v-bind:class="{'v-btn--active': editMode === 'pen'}">
              <v-icon>mdi-draw</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  {{'色彩'}}
                  <v-btn v-for="(c, index) in colorOpt" :key="index" :color="c" dense depressed tile small icon @click="colorSelector('pen', c)">
                    <v-icon v-if="color.pen !== c">mdi-checkbox-blank-circle</v-icon>
                    <v-icon v-else>mdi-record-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  {{'粗细'}}
                  <v-btn v-for="(width, index) in widthOpt" :key="index" :color="lineWidth.pen === width? 'primary' : 'black'" dense depressed tile small icon @click="widthSelector('pen', width)">
                    <v-icon>{{`mdi-numeric-${width}-box-outline`}}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-menu
          :v-model="picker.line"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn depressed color="white" v-on="on" @click="handleMode('line')" v-bind:class="{'v-btn--active': editMode === 'line'}">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  {{'色彩'}}
                  <v-btn v-for="(c, index) in colorOpt" :key="index" :color="c" dense depressed tile small icon @click="colorSelector('line', c)">
                    <v-icon v-if="color.line !== c">mdi-checkbox-blank-circle</v-icon>
                    <v-icon v-else>mdi-record-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  {{'粗细'}}
                  <v-btn v-for="(width, index) in widthOpt" :key="index" :color="lineWidth.line === width? 'primary' : 'black'" dense depressed tile small icon @click="widthSelector('line', width)">
                    <v-icon>{{`mdi-numeric-${width}-box-outline`}}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
        
        <v-menu
          :v-model="picker.rectangle"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn depressed color="white" v-on="on" @click="handleMode('rectangle')" v-bind:class="{'v-btn--active': editMode === 'rectangle'}">
              <v-icon>mdi-rectangle-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  {{'色彩'}}
                  <v-btn v-for="(c, index) in colorOpt" :key="index" :color="c" dense depressed tile small icon @click="colorSelector('rectangle', c)">
                    <v-icon v-if="color.rectangle !== c">mdi-checkbox-blank-circle</v-icon>
                    <v-icon v-else>mdi-record-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  {{'粗细'}}
                  <v-btn v-for="(width, index) in widthOpt" :key="index" :color="lineWidth.rectangle === width? 'primary' : 'black'" dense depressed tile small icon @click="widthSelector('rectangle', width)">
                    <v-icon>{{`mdi-numeric-${width}-box-outline`}}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-menu
          :v-model="picker.circle"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn depressed color="white" v-on="on" @click="handleMode('circle')" v-bind:class="{'v-btn--active': editMode === 'circle'}">
              <v-icon>mdi-circle-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  {{'色彩'}}
                  <v-btn v-for="(c, index) in colorOpt" :key="index" :color="c" dense depressed tile small icon @click="colorSelector('circle', c)">
                    <v-icon v-if="color.circle !== c">mdi-checkbox-blank-circle</v-icon>
                    <v-icon v-else>mdi-record-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  {{'粗细'}}
                  <v-btn v-for="(width, index) in widthOpt" :key="index" :color="lineWidth.circle === width? 'primary' : 'black'" dense depressed tile small icon @click="widthSelector('circle', width)">
                    <v-icon>{{`mdi-numeric-${width}-box-outline`}}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>

        <!-- <v-btn depressed color="white" @click="handleMode('colorpicker')">
          <v-icon>mdi-eyedropper-variant</v-icon>
        </v-btn> -->

        <v-btn depressed color="white" @click="handleMode('undo')" :disabled="current_obj_idx < 0">
          <v-icon>mdi-undo</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('redo')" :disabled="current_obj_idx >= objQueue.length - 1">
          <v-icon>mdi-redo</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('crop')">
          <v-icon>mdi-crop</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('save')">
          <v-icon color="green">mdi-check</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('cancel')">
          <v-icon color="red">mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="less" scoped>

</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

class Point {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

class Pen {
  pointList: Array<Point>
  lineWidth: string
  color: string
  show: boolean = true
  constructor(obj: any) {
    this.pointList = obj.pointList
    this.lineWidth = obj.lineWidth
    this.color = obj.color
  }
}

class Line {
  startPoint: Point
  endPoint: Point
  lineWidth: string
  color: string
  show: boolean = true
  constructor(obj: any) {
    this.startPoint = obj.startPoint
    this.endPoint = obj.endPoint
    this.lineWidth = obj.lineWidth
    this.color = obj.color
  }
}

class Rectangle {
  startPoint: Point
  width: number
  height: number
  lineWidth: string
  color: string
  show: boolean = true
  constructor(obj: any) {
    this.startPoint = obj.startPoint
    this.width = obj.width
    this.height = obj.height
    this.lineWidth = obj.lineWidth
    this.color = obj.color
  }
}

class Circle {
  startPoint: Point
  centerPoint: Point
  radiusX: number
  radiusY: number
  rotation: number = 0
  startAngle: number = 0
  endAngle: number = Math.PI * 2
  lineWidth: string
  color: string
  show: boolean = true
  constructor(obj: any) {
    this.startPoint = obj.startPoint
    this.centerPoint = obj.startPoint
    this.radiusX = obj.radiusX
    this.radiusY = obj.radiusY
    this.lineWidth = obj.lineWidth
    this.color = obj.color
  }
}

class Picture {
  data: any
  startPoint: Point
  width: number
  height: number
  show: boolean = true
  constructor(obj: any) {
    this.data = obj.data
    this.startPoint = obj.startPoint
    this.width = obj.width
    this.height = obj.height
  }
}

class ColorRec {
  pen: string = '#FF0000'
  line: string = '#FF0000'
  rectangle: string = '#FF0000'
  circle: string = '#FF0000'
}

class WidthRec {
  pen: number = 1
  line: number = 1
  rectangle: number = 1
  circle: number = 1
}

class Picker {
  pen: boolean = false
  line: boolean = false
  rectangle: boolean = false
  circle: boolean = false
}

@Component
export default class ImageEditor extends Vue {
  container : any = null
  ctx : any = null

  editMode: any = ''

  isDrawing : boolean = false
  startPosition: any = { x: 0, y: 0 }

  objQueue: Array<any> = []
  current_obj_idx: number = -1

  colorOpt: Array<string> = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#673AB7', '#FF9800']
  widthOpt: Array<number> = [1, 2, 3, 4, 5, 6, 7]
  
  picker : Picker = new Picker()
  color : ColorRec = new ColorRec()
  lineWidth : WidthRec = new WidthRec()

  imgReader: any = null

  mounted() {
    this.container = document.getElementById('imageEditor')
    this.ctx = this.container.getContext('2d')
    this.initImageReader()

    this.container.addEventListener('mousedown', this.mouseDownHandler, false)
    this.container.addEventListener('mousemove', this.mouseMoveHandler, false)
    this.container.addEventListener('mouseup', this.mouseUpHandler, false)
    document.body.addEventListener('paste', this.pasteFromClipboard, false)
  }

  destroy() {
    document.body.removeEventListener('paste', this.pasteFromClipboard)
  }

  colorSelector (type: string, color: string) {
    this.color[type] = color
  }

  widthSelector (type: string, width: number) {
    this.lineWidth[type] = width
  }

  updatePickerShow (type: string) {
    this.picker = new Picker()
    this.picker[type] = true
  }

  handleMode (val) {
    if (val === 'undo') {
      if (this.current_obj_idx >= 0) {
        this.objQueue[this.current_obj_idx].show = false
        --this.current_obj_idx
        this.clearCanvas()
        this.renderObj()
      }
    } else if (val === 'redo') {
      if (this.current_obj_idx < this.objQueue.length - 1) {
        ++this.current_obj_idx
        this.objQueue[this.current_obj_idx].show = true
        this.clearCanvas()
        this.renderObj()
      }
    } else if (val === 'save') {
      this.saveImage()
    } else if (val === 'cancel') {

    } else {
      this.editMode = val
      this.updatePickerShow(val)
    }
  }

  handleMousePosition (e) {
    e.preventDefault()
    return {
      x : e.offsetX,
      y : e.offsetY
    }
  }

  clearCanvas () {
    this.ctx.clearRect(0, 0, this.container.width, this.container.height);  
  }

  renderObj () {
    this.objQueue.forEach((obj : any )=> {
      if (obj.show) {
        if (obj instanceof Pen) {
          let startPoint : Point = obj.pointList[0]
          let endPoint : Point = obj.pointList[obj.pointList.length-1]
          this.ctx.beginPath()
          if (obj.pointList.length >= 4) {
            for(let i = 3; i < obj.pointList.length; i+=2) {
              let ctrlPoint1 : Point = obj.pointList[i-2]
              let ctrlPoint2 : Point = obj.pointList[i-1]
              let targ_x : number = (obj.pointList[i-1].x + obj.pointList[i].x) / 2
              let targ_y : number = (obj.pointList[i-1].y + obj.pointList[i].y) / 2
              this.ctx.moveTo(startPoint.x, startPoint.y)
              this.ctx.bezierCurveTo(ctrlPoint1.x, ctrlPoint1.y, ctrlPoint2.x, ctrlPoint2.y, targ_x, targ_y)
              startPoint = new Point(targ_x, targ_y)
            }
          } else if (obj.pointList.length == 3) {
            let ctrlPoint : Point = obj.pointList[1]
            this.ctx.moveTo(startPoint.x, startPoint.y)
            this.ctx.quadraticCurveTo(ctrlPoint.x, ctrlPoint.y, endPoint.x, endPoint.y)
          } else {
            this.ctx.lineTo(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
          }
          this.ctx.lineWidth = obj.lineWidth;
          this.ctx.strokeStyle = obj.color;
          this.ctx.stroke()
          this.ctx.closePath()
        } else if (obj instanceof Line) {
          this.ctx.beginPath()
          this.ctx.moveTo(obj.startPoint.x, obj.startPoint.y)
          this.ctx.lineTo(obj.endPoint.x, obj.endPoint.y)
          this.ctx.lineWidth = obj.lineWidth;
          this.ctx.strokeStyle = obj.color;
          this.ctx.stroke()
          this.ctx.closePath()
        } else if (obj instanceof Rectangle) {
          this.ctx.beginPath();
          this.ctx.rect(obj.startPoint.x, obj.startPoint.y, obj.width, obj.height)
          this.ctx.lineWidth = obj.lineWidth;
          this.ctx.strokeStyle = obj.color;
          this.ctx.stroke()
          this.ctx.closePath()
        } else if (obj instanceof Circle) {
          this.ctx.beginPath();
          this.ctx.ellipse(obj.centerPoint.x, obj.centerPoint.y, obj.radiusX, obj.radiusY, obj.rotation, obj.startAngle, obj.endAngle)
          this.ctx.lineWidth = obj.lineWidth;
          this.ctx.strokeStyle = obj.color;
          this.ctx.stroke()
          this.ctx.closePath()
        } else if (obj instanceof Picture) {
          this.ctx.drawImage(obj.data, obj.startPoint.x, obj.startPoint.y, obj.width, obj.height)
        }
      }
    });
  }

  removeUnvisibleObj () {
    while(this.objQueue.length > this.current_obj_idx + 1) {
      this.objQueue.pop()
    }
  }

  mouseDownHandler (e) {
    if (this.isDrawing) return
    this.isDrawing = true

    let position : any = this.handleMousePosition(e)
    this.removeUnvisibleObj()
    switch(this.editMode) {
      case 'pen':
        let penObj : Pen = new Pen({
          pointList: [new Point(position.x, position.y)],
          lineWidth: this.lineWidth.pen,
          color: this.color.pen
        })
        this.objQueue.push(penObj)
        this.current_obj_idx++
        break
      case 'line':
        let lineObj : Line = new Line({
          startPoint: new Point(position.x, position.y),
          endPoint: new Point(position.x, position.y),
          lineWidth: this.lineWidth.line,
          color: this.color.line
        })
        this.objQueue.push(lineObj)
        this.current_obj_idx++
        break
      case 'rectangle':
        let rectObj : Rectangle = new Rectangle({
          startPoint: new Point(position.x, position.y),
          width: 1,
          height: 1,
          lineWidth: this.lineWidth.rectangle,
          color: this.color.rectangle
        })
        this.objQueue.push(rectObj)
        this.current_obj_idx++
        break
      case 'circle':
        let circObj : Circle = new Circle({
          startPoint: new Point(position.x, position.y),
          radiusX: 1,
          radiusY: 1,
          lineWidth: this.lineWidth.circle,
          color: this.color.circle
        })
        this.objQueue.push(circObj)
        this.current_obj_idx++
        break
    }
    this.clearCanvas()
    this.renderObj()
  }

  mouseMoveHandler (e) {
    if (!this.isDrawing) return
    let position : any = this.handleMousePosition(e)
    switch(this.editMode) {
      case 'pen':
        let penObj: Pen = this.objQueue.pop()
        penObj.pointList.push(new Point(position.x, position.y))
        this.objQueue.push(penObj)
        break
      case 'line':
        let lineObj: Line = this.objQueue.pop()
        lineObj.endPoint = new Point(position.x, position.y)
        this.objQueue.push(lineObj)
        break
      case 'rectangle':
        let rectObj : Rectangle = this.objQueue.pop()
        rectObj.width = position.x - rectObj.startPoint.x
        rectObj.height = position.y - rectObj.startPoint.y
        this.objQueue.push(rectObj)
        break
      case 'circle':
        let circObj : Circle = this.objQueue.pop()
        circObj.radiusX = Math.abs(position.x - circObj.startPoint.x) / 2
        circObj.radiusY = Math.abs(position.y - circObj.startPoint.y) / 2
        circObj.centerPoint = new Point((position.x + circObj.startPoint.x) / 2, (position.y + circObj.startPoint.y) / 2)
        this.objQueue.push(circObj)
        break
    }
    this.clearCanvas()
    this.renderObj()
  }

   mouseUpHandler (e) {
    if (!this.isDrawing) return
    this.isDrawing = false
    let position : any = this.handleMousePosition(e)

    switch(this.editMode) {
      case 'pen':
        let penObj: Pen = this.objQueue.pop()
        penObj.pointList.push(new Point(position.x, position.y))
        this.objQueue.push(penObj)
        break
      case "line":
        let lineObj: Line = this.objQueue.pop()
        lineObj.endPoint = new Point(position.x, position.y)
        this.objQueue.push(lineObj)
        break
      case 'rectangle':
        let rectObj : Rectangle = this.objQueue.pop()
        rectObj.width = position.x - rectObj.startPoint.x
        rectObj.height = position.y - rectObj.startPoint.y
        this.objQueue.push(rectObj)
        break
      case 'circle':
        let circObj : Circle = this.objQueue.pop()
        circObj.radiusX = Math.abs(position.x - circObj.startPoint.x) / 2
        circObj.radiusY = Math.abs(position.y - circObj.startPoint.y) / 2
        circObj.centerPoint = new Point((position.x + circObj.startPoint.x) / 2, (position.y + circObj.startPoint.y) / 2)
        this.objQueue.push(circObj)
        break
    }
    this.clearCanvas()
    this.renderObj()
  }

  addImage (img) {
    // this.ctx.drawImage(img, 0, 0, 400, 300)
    let picObj : Picture = new Picture({
      startPoint: new Point(0, 0),
      data: img,
      width: this.container.width,
      height: this.container.height
    })
    this.objQueue.push(picObj)
    this.current_obj_idx++

    this.clearCanvas()
    this.renderObj()
  }

  initImageReader () {
    this.imgReader = (item) => {
      let blob : any = item.getAsFile()
      let reader : FileReader = new FileReader()

      reader.onload = (e) => {
        let img : any = new Image()
        img.onload = () => {
          this.addImage(img)
        }
        img.src = e.target.result
        // document.body.appendChild( img )
      }
      reader.readAsDataURL( blob );
    };
  }

  pasteFromClipboard (e) {
    let clipboardData : any = e.clipboardData
    let i : number = 0
    let items : any = null, item : any = null, types : any = null

    if (clipboardData){
      items = clipboardData.items;

      if( !items ){
        return;
      }

      item = items[0];
      types = clipboardData.types || [];

      for( ; i < types.length; i++ ){
        if( types[i] === 'Files' ){
          item = items[i];
          break;
        }
      }

      if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
          this.imgReader( item );
      }
    }
  }

  saveImage () {
    var image = new Image();
    image.src = this.container.toDataURL("image/png");
    // image.src = image.src.replace(/^data:image\/(png|jpg);base64,/, "")
    document.body.appendChild( image )
    return image;
  }
}
</script>