import { ActionsUnion, IGatsbyState, IGatsbyJobV2 } from "../types"

const jobDefaultValue = {
  contentDigest: ``,
  inputPaths: [],
}

export const jobsV2Reducer = (
  state: IGatsbyState["jobsV2"] = {
    incomplete: new Map(),
    complete: new Map(),
  },
  action: ActionsUnion
): IGatsbyState["jobsV2"] => {
  switch (action.type) {
    case `CREATE_JOB_V2`: {
      const { job = jobDefaultValue, plugin } = action.payload

      state.incomplete.set(job.contentDigest, {
        job,
        plugin,
      })

      return state
    }

    case `END_JOB_V2`: {
      const { jobContentDigest, result } = action.payload
      const { job = jobDefaultValue } = state.incomplete.get(
        jobContentDigest
      ) as IGatsbyJobV2

      state.incomplete.delete(job.contentDigest)

      // inputPaths is used to make sure the job is not stale
      state.complete.set(job.contentDigest, {
        result,
        inputPaths: job.inputPaths,
      })

      return state
    }

    case `REMOVE_STALE_JOB_V2`: {
      const { contentDigest } = action.payload
      state.incomplete.delete(contentDigest)
      state.complete.delete(contentDigest)

      return state
    }
  }

  return state
}
