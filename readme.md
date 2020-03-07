# hashtag

use hashtags to navigate a code structure.

```bash
yarn add @peacefultruth/hashtag
````



##### interleave hashtags

```js

import {
  hashtags,
} from "@peacefultruth/hashtag";

expect(
  hashtags(
    "it ws a #nice and #sunny-day in #Berlin"
  )
).toEqual(
  ["nice", "sunny_day", "Berlin"]
)

````



##### use hashtags to navigate a code structure

```js

import { instruct } from "@peacefultruth/hashtag";

const degrees_celsius = 28;

expect(
  instruct({
    reference: {
      sunny_day: {},
      nice: {
        sunny_day: ({ degrees_celsius }) => (
          `${degrees_celsius} degrees celsius`
        )
      },
      vitamind: previous_value => (
        `${previous_value}.
        I have had some sun for today.`
      )
    },
    instructions: [
      [
        {
          degrees_celsius
        },
        "it ws a #nice and #sunny-day in #Berlin"
      ],
      ["got some #vitamind"]
    ]
  })
).toEqual(
  `${degrees_celsius} degrees celsius.
  I have had some sun for today.`
);
````



##### match hashtag strings by scoring them

```js

import {
  score_hashtags_match,
} from "@peacefultruth/hashtag";

expect(
  score_hashtags_match(
    hashtags(
      "it ws a #nice and #sunny-day in #Berlin"
    ),
    hashtags(
      "all the #nice #sunny days in #Berlin"
    )
  )
).toEqual(
  3
);

````