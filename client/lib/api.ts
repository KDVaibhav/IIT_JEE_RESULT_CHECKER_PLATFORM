export const fetchResultByHallTicket = async (hallTicket: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/result/${hallTicket}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Something went wrong');
    }
    return res.json();
  };
  