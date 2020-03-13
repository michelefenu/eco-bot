const service = require('./service');

describe("Exported methods", () => {
    it("should export getCityName", () => {
        expect(service.getCityName).toBeTruthy();
    });

    it("should export getCityCode", () => {
        expect(service.getCityCode).toBeTruthy();
    });

    it("should export getCityData",  () => {
        expect(service.getCityData).toBeTruthy();
    });

    it("should export getCollectionInfo", () => {
        expect(service.getCollectionInfo).toBeTruthy();
    });

    it("should export getEcocentro", () => {
        expect(service.getEcocentro).toBeTruthy();
    });

    it("should export getIngombranti", () => {
        expect(service.getIngombranti).toBeTruthy();
    });

    it("should export getSpeciali", () => {
        expect(service.getSpeciali).toBeTruthy();
    });

    it("should export getTomorrowSchedule", () => {
        expect(service.getTomorrowSchedule).toBeTruthy();
    });

    it("should export getCalendar", () => {
        expect(service.getCalendar).toBeTruthy();
    });
});
