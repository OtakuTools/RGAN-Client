<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <canvas id="imageEditor" style="border:1px solid black;" width="400" height="300"></canvas>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn depressed color="white" @click="handleMode('pen')" v-bind:class="{'v-btn--active': editMode === 'pen'}">
          <v-icon>mdi-draw</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('line')" v-bind:class="{'v-btn--active': editMode === 'line'}">
          <v-icon>mdi-minus</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('rectangle')" v-bind:class="{'v-btn--active': editMode === 'rectangle'}">
          <v-icon>mdi-rectangle-outline</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('circle')" v-bind:class="{'v-btn--active': editMode === 'circle'}">
          <v-icon>mdi-circle-outline</v-icon>
        </v-btn>

        <!-- <v-btn depressed color="white" @click="handleMode('text')">
          <v-icon>mdi-format-text</v-icon>
        </v-btn> -->

        <v-btn depressed color="white" @click="handleMode('colorpicker')">
          <v-icon>mdi-eyedropper-variant</v-icon>
        </v-btn>

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
    <v-dialog v-model="openColorPicker" width="300">
      <v-card>
        <v-card-title>颜色选择</v-card-title>
        <v-card-text>
          <v-color-picker flat v-model="color"></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="colorPickerSubmit()">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  startPoint: Point
  pointList: Array<Point>
  lineWidth: string
  color: string
  show: boolean = true
  constructor(obj: any) {
    this.startPoint = obj.startPoint
    this.pointList = []
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

@Component
export default class ImageEditor extends Vue {
  container : any = null
  ctx : any = null

  editMode: any = "line"

  openColorPicker : boolean = false
  color : any = "#FF0000"

  isDrawing : boolean = false
  startPosition: any = { x: 0, y: 0 }

  objQueue: Array<any> = []
  current_obj_idx: number = -1

  mounted() {
    this.container = document.getElementById('imageEditor')
    this.ctx = this.container.getContext('2d')

    this.container.addEventListener('mousedown', this.mouseDownHandler, false)
    this.container.addEventListener('mousemove', this.mouseMoveHandler, false)
    this.container.addEventListener('mouseup', this.mouseUpHandler, false)
  }

  colorPickerSubmit () {
    this.openColorPicker = false
  }

  handleMode (val) {
    if (val === 'colorpicker') {
      this.openColorPicker = true
    } else if (val === 'undo') {
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
    }
  }

  handleMousePosition (e) {
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
          this.ctx.beginPath()
          this.ctx.moveTo(obj.startPoint.x, obj.startPoint.y)
          obj.pointList.forEach(point => {
            this.ctx.lineTo(point.x, point.y)
          })
          this.ctx.lineWidth = obj.lineWidth;
          this.ctx.strokeStyle = obj.color;
          this.ctx.stroke()
        } else if (obj instanceof Line) {
          this.ctx.beginPath()
          this.ctx.moveTo(obj.startPoint.x, obj.startPoint.y)
          this.ctx.lineTo(obj.endPoint.x, obj.endPoint.y)
          this.ctx.lineWidth = obj.lineWidth;
          this.ctx.strokeStyle = obj.color;
          this.ctx.stroke()
        } else if (obj instanceof Rectangle) {
          this.ctx.beginPath();
          this.ctx.rect(obj.startPoint.x, obj.startPoint.y, obj.width, obj.height)
          this.ctx.lineWidth = obj.lineWidth;
          this.ctx.strokeStyle = obj.color;
          this.ctx.stroke()
        } else if (obj instanceof Circle) {
          this.ctx.beginPath();
          this.ctx.ellipse(obj.centerPoint.x, obj.centerPoint.y, obj.radiusX, obj.radiusY, obj.rotation, obj.startAngle, obj.endAngle)
          this.ctx.lineWidth = obj.lineWidth;
          this.ctx.strokeStyle = obj.color;
          this.ctx.stroke()
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
          startPoint: new Point(position.x, position.y),
          lineWidth: 1,
          color: this.color
        })
        this.objQueue.push(penObj)
        break
      case 'line':
        let lineObj : Line = new Line({
          startPoint: new Point(position.x, position.y),
          endPoint: new Point(position.x, position.y),
          lineWidth: 1,
          color: this.color
        })
        this.objQueue.push(lineObj)
        break
      case 'rectangle':
        let rectObj : Rectangle = new Rectangle({
          startPoint: new Point(position.x, position.y),
          width: 1,
          height: 1,
          lineWidth: 1,
          color: this.color
        })
        this.objQueue.push(rectObj)
        break
      case 'circle':
        let circObj : Circle = new Circle({
          startPoint: new Point(position.x, position.y),
          radiusX: 1,
          radiusY: 1,
          lineWidth: 1,
          color: this.color
        })
        this.objQueue.push(circObj)
        break
    }
    this.current_obj_idx++
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
        circObj.radiusX = Math.floor(Math.abs(position.x - circObj.startPoint.x) / 2)
        circObj.radiusY = Math.floor(Math.abs(position.y - circObj.startPoint.y) / 2)
        circObj.centerPoint = new Point(Math.floor((position.x + circObj.startPoint.x) / 2), Math.floor((position.y + circObj.startPoint.y) / 2))
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
        circObj.radiusX = Math.floor(Math.abs(position.x - circObj.startPoint.x) / 2)
        circObj.radiusY = Math.floor(Math.abs(position.y - circObj.startPoint.y) / 2)
        circObj.centerPoint = new Point(Math.floor((position.x + circObj.startPoint.x) / 2), Math.floor((position.y + circObj.startPoint.y) / 2))
        this.objQueue.push(circObj)
        break
    }
    this.clearCanvas()
    this.renderObj()
  }

  drawImage () {
    return true
  }

  saveImage () {
    var image = new Image();
    image.src = this.container.toDataURL("image/png");
    image.src = image.src.replace(/^data:image\/(png|jpg);base64,/, "")
    console.log(image)
    return image;
  }
}
</script>