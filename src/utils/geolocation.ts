export async function getCountryFromIP(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_name || 'Brasil';
  } catch (error) {
    console.error('Error fetching country:', error);
    return 'Brasil';
  }
}
