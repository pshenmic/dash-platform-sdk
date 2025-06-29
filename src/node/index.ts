import getStatus from './status'

export class NodeController {
    status() {
        return getStatus()
    }
}
