import { instruct, structure_options } from "./hashtag";
test("hashtag: instruct", () => {
  const degrees_celsius = 28;
  const input = {
    reference: {
      sunny_day: {},
      nice: {
        sunny_day: ({ degrees_celsius }) => `${degrees_celsius} degrees celsius`
      },
      vitamind: previous_value =>
        `${previous_value}. I have had some sun for today.`
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
  };
  const expected_output = `${degrees_celsius} degrees celsius. I have had some sun for today.`;
  const operation = instruct;
  const output = operation(input);
  return expect(output).toEqual(expected_output);
});
test("hashtag: instruct: prefilled options", () => {
  const degrees_celsius = 28;
  const reference = {
    sunny_day: {},
    nice: {
      sunny_day: ({ degrees_celsius }) => `${degrees_celsius} degrees celsius`
    }
  };
  const options = structure_options(reference);
  const input = {
    reference,
    options,
    instructions: [
      [
        {
          degrees_celsius
        },
        "it ws a #nice and #sunny-day in #Berlin"
      ]
    ]
  };
  const expected_output = `${degrees_celsius} degrees celsius`;
  const operation = instruct;
  const output = operation(input);
  return expect(output).toEqual(expected_output);
});
test("hashtag: instruct: error: prefilled options: incorrect options", () => {
  return expect(
    new Promise((resolve, reject) => {
      let value;
      let instruction_error;
      try {
        value = instruct({
          reference: {
            sunny_day: {},
            nice: {
              sunny_day: ({ degrees_celsius }) =>
                `${degrees_celsius} degrees celsius`
            }
          },
          options: structure_options({}),
          instructions: [["it ws a #nice and #sunny-day in #Berlin"]]
        });
      } catch (error) {
        instruction_error = error;
      }
      if (instruction_error) {
        reject(instruction_error);
        return;
      }
      resolve(value);
    })
  ).rejects.toEqual(
    new Error(
      `location doesnt exist: " it ws a #nice and #sunny-day in #Berlin"`
    )
  );
});
test("hashtag: instruct: error: prefilled options: incorrect reference", () => {
  return expect(
    new Promise((resolve, reject) => {
      let value;
      let instruction_error;
      try {
        value = instruct({
          reference: {},
          options: structure_options({
            sunny_day: {},
            nice: {
              sunny_day: ({ degrees_celsius }) =>
                `${degrees_celsius} degrees celsius`
            }
          }),
          instructions: [
            [
              {
                degrees_celsius
              },
              "it ws a #nice and #sunny-day in #Berlin"
            ]
          ]
        });
      } catch (error) {
        instruction_error = error;
      }
      if (instruction_error) {
        reject(instruction_error);
        return;
      }
      resolve(value);
    })
  ).rejects.toBeInstanceOf(ReferenceError);
});
test("hashtag: instruct: async", () => {
  const degrees_celsius = 28;
  const input = {
    reference: {
      sunny_day: {},
      nice: {
        sunny_day: ({ degrees_celsius }) =>
          Promise.resolve(`${degrees_celsius} degrees celsius`)
      },
      weather: () => Promise.resolve({ degrees_celsius })
    },
    instructions: [
      ["get the #weather"],
      ["it ws a #nice and #sunny-day in #Berlin"]
    ]
  };
  const expected_output = `${degrees_celsius} degrees celsius`;
  const operation = instruct;
  const output = operation(input);
  return expect(output).resolves.toEqual(expected_output);
});
test("hashtag: instruct: error: not a functional endpoint", () => {
  return expect(
    new Promise((resolve, reject) => {
      let value;
      let instruction_error;
      try {
        value = instruct({
          reference: {
            sunny_day: {},
            nice: {
              sunny_day: "degrees celsius"
            }
          },
          instructions: [["a #sunny_day, #nice"]]
        });
      } catch (error) {
        instruction_error = error;
      }
      if (instruction_error) {
        reject(instruction_error);
        return;
      }
      resolve(value);
    })
  ).rejects.toEqual(
    new Error(`location is not a function: \" a #sunny_day, #nice\"`)
  );
});
