import {expect} from 'chai';
import EventBus from "./eventBus";

describe('test event-bus', () => {
  const eventBus = new EventBus()
  let i = 0
  const handleTest1 = (num?: unknown) => {
    console.log(num)
    i++
  }
  it('добавляем события', () => {
    eventBus.on('test1', handleTest1)
    eventBus.on('test2', () => i++)
    eventBus.on('test3', () => i++)
    expect(eventBus.listeners).to.have.property('test1')
    expect(eventBus.listeners).to.have.property('test3')
    expect(Object.keys(eventBus.listeners).length).to.equal(3)
  })

  it('эмитим события', () => {
    eventBus.emit('test1', 'аргумент события test1')
    eventBus.emit('test2',)
    eventBus.emit('test3',)
    expect(i).to.equal(3)
  })

  it('удаляем события', () => {
    eventBus.off('test1', handleTest1 as () => {})
    expect(eventBus.listeners['test1'].length).to.equal(0)
    eventBus.emit('test1', 'аргумент события test1')
    expect(i).to.equal(3)
  })

  it('удаляем несуществующее событие, получаем сообщение об ошибке', () => {
    const delEvent = () => eventBus.off('unknown', handleTest1 as () => {})
    expect(delEvent).to.throw(Error)
  })
})