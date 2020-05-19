export function createContext() {
  const reports = [];

  function report(message) {
    reports.push({
      message,
    });
  }

  function getReports() {
    return reports;
  }

  return {
    report,
    getReports,
  };
}
