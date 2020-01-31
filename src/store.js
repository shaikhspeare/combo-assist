import { Subject } from 'rxjs'

const subject = new Subject();

const chatStore = {
  subscribe: setState => subject.subscribe(setState)
}