import GRPCConnectionPool from "../grpcConnectionPool";

export default class TokensController {
  grpcPool: GRPCConnectionPool

  constructor(grpcPool: GRPCConnectionPool) {
    this.grpcPool = grpcPool
  }
}