import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'

import { toToken } from './mapper'
import { IncentiveRepresentation, UserRepresentation } from './representations'
import { TokenType } from './types'

export class Incentive {
  public readonly id: string
  public readonly tokenType: string
  public readonly rewardRemaining: Amount<Token>
  public readonly liquidityStaked: Amount<Token>
  public readonly startTime: Date
  public readonly endTime: Date
  public readonly createdBy: UserRepresentation
  public constructor({ incentive }: { incentive: IncentiveRepresentation }) {
    this.id = incentive.id
    this.rewardRemaining = Amount.fromRawAmount(
      toToken(incentive.rewardToken, ChainId.KOVAN),
      incentive.rewardRemaining
    ) // TODO: pass in active network to constructor
    this.liquidityStaked = Amount.fromRawAmount(toToken(incentive.stakeToken, ChainId.KOVAN), incentive.liquidityStaked) // TODO: pass in active network to constructor
    this.tokenType = incentive.stakeToken?.type ? (<any>TokenType)[incentive.stakeToken?.type] : TokenType.UNKNOWN // FIXME: any hack?
    this.startTime = new Date(Number(incentive.startTime) * 1000)
    this.endTime = new Date(Number(incentive.endTime) * 1000)
    this.createdBy = incentive.createdBy
  }

  public get remainingTime(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    const now = Date.now()
    const interval = this.endTime.getTime() - now
    if (interval > 0) {
      const days = Math.floor(interval / (1000 * 60 * 60 * 24))
      const hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}