import { configureStore } from '@reduxjs/toolkit'
import { tokenLists } from 'lib/state/token-lists'

import { multicall } from './lib/state/multicall'

export const store = configureStore({
  reducer: {
    [multicall.reducerPath]: multicall.reducer,
    [tokenLists.reducerPath]: tokenLists.reducer,
  },
})
