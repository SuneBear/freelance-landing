import { World } from './world'

// Module 之间不会相互通讯，公用的东西放到 World 中或创建独立的 Manager
export class Module {
  world: World

  constructor(world: World) {
    this.world = world
  }

  setup () {

  }

  update (delta: number) {

  }

  resize (width: number, height: number) {

  }

}

export class ModuleManager {
  world: World
  modules: any[] = []

  constructor(world: World) {
    this.world = world
  }

  add<T extends Module>(Class: any) {
    const module = new Class(this.world)
    module.setup()
    this.modules.push(module)
  }

  update (delta: number) {
    this.modules.map(module => {
      module.update(delta)
    })
  }

  resize (width: number, height: number) {
    this.modules.map(module => {
      module.resize(width, height)
    })
  }

}
