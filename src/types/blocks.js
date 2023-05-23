/**
 * Types for the Particle Blocks API
 * Responses have the same structure as the request, with additional fields
 */

/**
 * @typedef {Object} Block
 * @property {boolean} enabled Whether the block is enabled
 * @property {string} name The name of the block
 * @property {string} description A description of the block
 * @property {Logic} logic The logic to run for the block
 * @property {Matcher[]} matchers The matchers for the block
 *
 * @typedef {Object} Logic
 * @property {string} type Must be "JavaScript"
 * @property {string} code The JavaScript code to run
 *
 * @typedef {Object} PubSubMatcher
 * @property {string} type Must be "PubSub"
 * @property {boolean} enabled Whether the matcher is enabled
 * @property {number} product_id The ID of the product to match
 * @property {string} event_name The name of the event to match
 *
 * @typedef {Object} ChronMatcher
 * @property {string} type Must be "Chron"
 * @property {boolean} enabled Whether the matcher is enabled
 * @property {string} cron The cron schedule for the matcher
 * @property {string} [start_at] The start time for the matcher (ISO 8601 format)
 * @property {string} [end_at] The end time for the matcher (ISO 8601 format)
 *
 * @typedef {(PubSubMatcher | ChronMatcher)} Matcher
 *
 * @typedef {Object} BlockRun
 * @property {number} id The ID of the block run
 * @property {number} block_id The ID of the block
 * @property {"PubSub"|"Chron"} matcher_type The type of the matcher
 * @property {number} matcher_id The ID of the matcher
 * @property {"Success"|"Failure"} status The status of the block run
 * @property {string} started_at The start time of the block run (ISO 8601 format)
 * @property {string} finished_at The end time of the block run (ISO 8601 format)
 * @property {string} log_filename The name of the log file
 *
 * @typedef {Object} Log
 * @property {"Info"|"Warn"|"Error"} level The level of the log
 * @property {string} timestamp The time of the log (ISO 8601 format)
 * @property {any[]} args The arguments for the log
 *
 * @typedef {Object} BlockRunLog
 * @property {Log[]} logs An array of logs for the block run
 * @property {string} [err] The error message, if the block execution failed
 */

/**
 * @typedef {Object} BlockResponse
 * @property {boolean} enabled Whether the block is enabled
 * @property {string} name The name of the block
 * @property {string} description A description of the block
 * @property {Logic} logic The logic to run for the block
 * @property {number} id The id of the block
 * @property {string} owner_id The id of the owner of the block
 * @property {string} version The version of the block
 * @property {string} created_at The creation date of the block (ISO 8601 format)
 * @property {string} updated_at The update date of the block (ISO 8601 format)
 * @property {string} created_by The creator of the block
 * @property {string} updated_by The updater of the block
 * @property {MatcherResponse[]} matchers The matchers associated with the block
 *
 * @typedef {Object} PubSubMatcherResponse
 * @property {string} type Must be "PubSub"
 * @property {boolean} enabled Whether the matcher is enabled
 * @property {number} product_id The ID of the product to match
 * @property {string} event_name The name of the event to match
 * @property {string} id The id of the matcher
 * @property {string} block_id The id of the block
 * @property {number} version The version of the matcher
 * @property {string} last_scheduled_at The last time the matcher was scheduled (ISO 8601 format)
 * @property {string} next_unscheduled_at The next time the matcher will be scheduled (ISO 8601 format)
 *
 * @typedef {Object} ChronMatcherResponse
 * @property {string} type Must be "Chron"
 * @property {boolean} enabled Whether the matcher is enabled
 * @property {string} cron The cron schedule for the matcher
 * @property {string} start_at The start time for the matcher (ISO 8601 format)
 * @property {string} end_at The end time for the matcher (ISO 8601 format)
 * @property {string} id The id of the matcher
 * @property {string} block_id The id of the block
 *
 * @typedef {(PubSubMatcherResponse | ChronMatcherResponse)} MatcherResponse
 */

// export all JSDoc types
module.exports = {};
