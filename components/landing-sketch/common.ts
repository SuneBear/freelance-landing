import * as THREE from 'three'

// 解决循环依赖的问题
export const loadingManager = new THREE.LoadingManager()
