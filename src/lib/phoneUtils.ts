export const formatPhoneNumber = (countryCode: string, areaCode: string, number: string): string => {
  const cleanNumber = number.replace(/\D/g, "");
  
  if (!areaCode && !cleanNumber) {
    return "";
  }

  if (!cleanNumber) {
    return `${countryCode} (${areaCode})`;
  }

  if (cleanNumber.length <= 4) {
    return `${countryCode} (${areaCode}) ${cleanNumber}`;
  }

  if (cleanNumber.length <= 8) {
    return `${countryCode} (${areaCode}) ${cleanNumber.slice(0, 4)}-${cleanNumber.slice(4)}`;
  }

  if (cleanNumber.length === 9) {
    return `${countryCode} (${areaCode}) ${cleanNumber.slice(0, 1)} ${cleanNumber.slice(1, 5)}-${cleanNumber.slice(5, 9)}`;
  }

  if (cleanNumber.length === 8) {
    return `${countryCode} (${areaCode}) ${cleanNumber.slice(0, 4)}-${cleanNumber.slice(4, 8)}`;
  }

  return `${countryCode} (${areaCode}) ${cleanNumber}`;
};

export const formatPhoneInput = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  
  if (numbers.length <= 4) {
    return numbers;
  }

  if (numbers.length <= 8) {
    return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
  }

  return `${numbers.slice(0, 1)} ${numbers.slice(1, 5)}-${numbers.slice(5, 9)}`;
};

export const formatAreaCode = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 2);
};

