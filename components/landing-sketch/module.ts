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
  }

  update (delta: number) {
    this.modules.map(module => {
      module.update(delta)
    })
  }

}
