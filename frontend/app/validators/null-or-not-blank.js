import { capitalize } from "@ember/string";

export default function validateNullOrNotBlank() {
  return (key, newValue) => {
    return (
      !!(newValue === null || (newValue && newValue.length > 0)) ||
      `${capitalize(key)} must be null or not blank`
    );
  };
}
