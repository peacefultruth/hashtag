//
// https://gist.github.com/preslavrachev/3142823
// match(/\B#\w*[a-zA-Z\-]\w*/g)
//
export const hashtags = text =>
  (text || "")
    .match(/\B#\w*[a-zA-Z\-]+\b/g)
    .map(category => category.replace(/\#/g, ""))
    .map(category => category.replace(/\-/g, "_"));

export const score_hashtags_match = (aaaa, bbbb) => {
  let score_value = 0;
  const increment_score = () => {
    score_value = score_value + 1;
  };
  const decrement_score = () => {
    score_value = score_value - 1;
  };
  aaaa.forEach(aaaa_tag => {
    if (bbbb.some(bbbb_tag => aaaa_tag === bbbb_tag)) {
      increment_score();
    } else {
      decrement_score();
    }
  });
  const aaaa_length = aaaa.length;
  const bbbb_length = bbbb.length;
  const difference_in_length = Math.abs(aaaa_length - bbbb_length);
  const definite_non_matches = difference_in_length;
  score_value = score_value - definite_non_matches;

  return score_value;
};

export const interfaces = structure => {
  if (typeof structure !== "object" && typeof structure !== "function") {
    return [];
  }

  let interface_names;
  try {
    const structure_interface_names = Object.keys(structure);
    interface_names = structure_interface_names;
  } catch (error) {}

  let array_of_interfaces = [];
  (interface_names || []).forEach(key => {
    array_of_interfaces = [
      ...array_of_interfaces,
      ...[
        {
          name: key,
          position: structure[key]
        }
      ]
    ];
  });

  return array_of_interfaces;
};
export const structure_options = structure => {
  let options = [];
  const add_an_option = waypoints => {
    options = [...options, ...[waypoints]];
  };

  const one = ({ position, waypoints }) => {
    const the_interfaces_at_this_position = interfaces(position);
    the_interfaces_at_this_position.forEach(
      ({ name, position: inner_position }) => {
        const this_location = [...waypoints, ...[name]];
        add_an_option(this_location);
        one({
          position: inner_position,
          waypoints: this_location
        });
      }
    );
  };

  one({
    position: structure,
    waypoints: []
  });

  return options;
};

export const score_options_against_category_tags = ({
  options,
  category_tags
}) => {
  const scored_options = options.map(option => {
    const score = score_hashtags_match(option, category_tags);
    return { option, score };
  });

  let high_score = null;
  let highest_scoring_option;
  scored_options.forEach(({ option, score }) => {
    if (high_score === null || score > high_score) {
      high_score = score;
      highest_scoring_option = option;
    }
  });

  let how_many_of_the_highest_score = 0;
  scored_options.forEach(({ score }) => {
    if (score === high_score) {
      how_many_of_the_highest_score = how_many_of_the_highest_score + 1;
    }
  });
  let ambigious_endpoint = how_many_of_the_highest_score > 1;

  if (ambigious_endpoint) {
    return [];
  }
  if (highest_scoring_option) {
    return highest_scoring_option;
  }
  return [];
};

export const instruct = ({ reference, options, instructions } = {}) => {
  if (!options) {
    options = structure_options(reference);
  }
  if (!Array.isArray(instructions)) {
    instructions = undefined;
  }
  let state = {};
  let previous_result;
  let is_this_the_first_item = true;
  (instructions || []).forEach(instruction => {
    let instruction_the_array;
    if (Array.isArray(instruction)) {
      instruction_the_array = instruction;
    } else {
      instruction_the_array = [instruction];
    }
    let category = "";
    instruction_the_array.forEach(item_in_instruction => {
      if (typeof item_in_instruction === "string") {
        category = `${category} ${item_in_instruction}`;
      }
      if (typeof item_in_instruction === "object") {
        state = {
          ...state,
          ...item_in_instruction
        };
      }
    });

    const category_tags = hashtags(category);

    const location = score_options_against_category_tags({
      options,
      category_tags
    });
    if (location.length < 1) {
      throw new Error(`location doesnt exist: "${category}"`);
    }

    let position = reference;
    location.forEach(waypoint => {
      position = position[waypoint];
    });

    if (typeof position !== "function") {
      throw new Error(`location is not a function: "${category}"`);
    }

    const value = synchron({
      reference,
      waypoints: location,
      state,
      previous_result,
      is_this_the_first_item
    });

    is_this_the_first_item = false;
    previous_result = value;
  });

  return previous_result;
};
const synchron = ({
  reference,
  is_this_the_first_item,
  previous_result,
  waypoints,
  state
}) => {
  const run_one_right_now_like = the_previous_result_as_a_synchronous_value =>
    instruction_execution({
      reference,
      waypoints,
      state,
      previous_result: the_previous_result_as_a_synchronous_value,
      is_this_the_first_item
    });

  let the_next_result;

  const {
    affirmative: the_previous_result_a_promise,
    negative: the_previous_result_a_synchronous_value
  } = is_a_promise(previous_result);
  if (the_previous_result_a_promise) {
    the_next_result = previous_result.then(run_one_right_now_like);
  }
  if (the_previous_result_a_synchronous_value) {
    the_next_result = run_one_right_now_like(previous_result);
  }
  return the_next_result;
};
const is_a_promise = value => {
  let is_this_value_a_promise;

  if (Promise.resolve(value) == value) {
    is_this_value_a_promise = true;
  }

  const value_is_not_a_promise = !is_this_value_a_promise;

  return {
    affirmative: is_this_value_a_promise,
    negative: value_is_not_a_promise
  };
};
const instruction_execution = ({
  // arguments
  reference,
  previous_result: the_previous_result_as_a_synchronous_value,
  state: current_state_store,
  waypoints: the,
  is_this_the_first_item
}) => {
  let relayed_result = the_previous_result_as_a_synchronous_value;

  const the_previous_result_is_an_object__combinable_with_the_state =
    typeof the_previous_result_as_a_synchronous_value === "object";
  if (the_previous_result_is_an_object__combinable_with_the_state) {
    relayed_result = {
      ...current_state_store,
      ...relayed_result
    };
  }

  if (is_this_the_first_item) {
    relayed_result = current_state_store;
  }

  let position = reference;
  the.forEach(waypoint => {
    position = position[waypoint];
  });

  const value = position(relayed_result);

  return value;
};
