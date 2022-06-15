import { extend } from "./shared"


class ReactiveEffect{
    private _fn: Function
    public scheduler
    deps = []
    active = true
    onStop?: () => void
    constructor(fn,scheduler?) {
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        activeEffect = this
        return this._fn()
    }

    stop() {
        if(this.active){
            debugger
            cleanupEffect(this)
            if(this.onStop) {
                this.onStop()
            }
            this.active = false
        }
        
    }
}


function cleanupEffect(effect) {
    effect.deps.forEach((dep: any)=>{
        dep.delete(effect)
    }) 
}

const targetMap = new Map()
let activeEffect

export function track(target,key) {
    let depMap = targetMap.get(target)
    if(!depMap) {
        depMap = new Map()
        targetMap.set(target,depMap)
    }
    let deps  = depMap.get(key)
    if(!deps) {
        deps = new Set()
        depMap.set(key,deps)
    }

    if(!activeEffect) return

    deps.add(activeEffect)
    activeEffect.deps.push(deps)
}


export function trigger(target,key) {
    const depMap = targetMap.get(target)
    const deps = depMap.get(key)
    for(let effect of deps) {
        if(effect.scheduler) {
            effect.scheduler()
        }else {
            effect.run()
        }
       
    }

}


export function effect(fn,options:any  = {}) {
    const _effect = new ReactiveEffect(fn,options.scheduler)
    extend(_effect,options)
    _effect.run()

    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return  runner
}


export function stop(runner) {
    runner.effect.stop()
}