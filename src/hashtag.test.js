import {
  hashtags,
  tags_by_spaces,
  score_hashtags_match,
  structure_options,
  interfaces,
  score_options_against_category_tags
} from "./hashtag";
test(`
  hashtag: hashtags
`, () => {
  const input = "it ws a #nice and #sunny-day in #Berlin";
  const expected_output = ["nice", "sunny_day", "Berlin"];
  const operation = hashtags;
  const output = operation(input);
  return expect(output).toEqual(expected_output);
});
test(`
  hashtag: hashtags: longer names
`, () => {
  const input = "#source-control-repository #copy #constraints #a-main-meal #not-coming-with-gravy";
  const expected_output = ["source_control_repository", "copy", "constraints", "a_main_meal", "not_coming_with_gravy"];
  const operation = hashtags;
  const output = operation(input);
  return expect(output).toEqual(expected_output);
});
test(`
  hashtag: score_hashtags_match
`, () => {
  const aaaa_tags = hashtags("it ws a #nice and #sunny day in #Berlin");
  const bbbb_tags = hashtags("all the #nice #sunny days");
  const first_output = score_hashtags_match(aaaa_tags, bbbb_tags);
  expect(first_output).toEqual(0);
  const cccc_tags = hashtags("all the #nice #sunny days in #Berlin");
  const second_output = score_hashtags_match(aaaa_tags, cccc_tags);
  expect(second_output).toEqual(3);
});
test(`
  hashtag: interfaces
`, () => {
  expect(interfaces()).toEqual([]);
  expect(interfaces(10)).toEqual([]);
  expect(interfaces({})).toEqual([]);

  const input = {
    sunny_day: {},
    nice: {
      sunny_day: {
        Berlin: {}
      }
    }
  };
  const expected_output = [
    { name: "sunny_day", position: {} },
    { name: "nice", position: { sunny_day: { Berlin: {} } } }
  ];
  const output = interfaces(input);
  return expect(output).toEqual(expected_output);
});
test(`
  hashtag: interfaces: functions
`, () => {
  const input = () => {};
  input.my_interface = {};
  const expected_output = [{ name: "my_interface", position: {} }];
  const output = interfaces(input);
  return expect(output).toEqual(expected_output);
});
test(`
  hashtag: interfaces: non objects
`, () => {
  const input = [];
  const expected_output = [];
  const output = interfaces(input);
  return expect(output).toEqual(expected_output);
});
test(`
  hashtag: options
`, () => {
  const input = {
    sunny_day: {},
    nice: {
      sunny_day: {
        Berlin: {}
      }
    }
  };
  const expected_output = [
    ["sunny_day"],
    ["nice"],
    ["nice", "sunny_day"],
    ["nice", "sunny_day", "Berlin"]
  ];
  const operation = structure_options;
  const output = operation(input);
  return expect(output).toEqual(expected_output);
});
test(`
  hashtag: score_options_against_category_tags
`, () => {
  const reference = {
    sunny_day: {},
    nice: {
      sunny_day: {
        Berlin: {}
      }
    }
  };
  const category = "it ws a #nice and #sunny-day in #Berlin";
  const expected_output = ["nice", "sunny_day", "Berlin"];

  const reference_options = structure_options(reference);
  const category_tags = hashtags(category);
  const input = {
    options: reference_options,
    category_tags
  };
  const output = score_options_against_category_tags(input);
  return expect(output).toEqual(expected_output);
});
test(`
  hashtag: score_options_against_category_tags
    : ambigiouty
`, () => {
  const reference = {
    sunny_day: {},
    nice: {
      sunny_day: {
        Berlin: {}
      }
    },
    sunny_day: {
      nice: {
        Berlin: {}
      }
    }
  };
  const category = "it ws a #nice and #sunny-day in #Berlin";
  const expected_output = [];

  const reference_options = structure_options(reference);
  const category_tags = hashtags(category);
  const input = {
    options: reference_options,
    category_tags
  };
  const output = score_options_against_category_tags(input);
  return expect(output).toEqual(expected_output);
});
