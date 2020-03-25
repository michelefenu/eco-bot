const cityDataMock = require('../spec/mocks/city-data-mock.json');
const service = require('./service');
const nock = require('nock');

describe("server.js: exported methods", () => {

    beforeEach(async () => {
        process.env.CITY_CODE = 'I384';
        process.env.NODE_ENV = 'Development';

        nock(`https://firebasestorage.googleapis.com`)
            .get(`/v0/b/eco-bot-data.appspot.com/o/${process.env.CITY_CODE}-dev.json?alt=media`)
            .reply(200, cityDataMock);

        await service.loadCityData();
    });

    afterEach(() => {
        delete process.env.CITY_CODE;
        delete process.env.NODE_ENV;
    });

    describe('server.js - loadCityData', () => {
        it("should export loadCityData", () => {
            expect(service.loadCityData).toBeTruthy();
        });
    });

    describe('server.js - getCalendar', () => {
        it("should export getCalendar", () => {
            expect(service.getCalendar).toBeTruthy();
        });

        it("should default to 7-days calendar", () => {
            expect(service.getCalendar().length).toEqual(7);
        });

        it("should return the correct number of days", () => {
            expect(service.getCalendar(12).length).toEqual(12);
        });

        it("should return the correct calendar", () => {
            // March 26, 2020 - 16:00:00 GMT
            spyOn(Date, 'now').and.returnValue(new Date("2020-03-25T16:00:00.000Z"));

            const calendar = service.getCalendar();

            const correctCalendar = [
                cityDataMock.Calendar['2020']['03']["26"],
                cityDataMock.Calendar['2020']['03']["27"],
                cityDataMock.Calendar['2020']['03']["28"],
                cityDataMock.Calendar['2020']['03']["29"],
                cityDataMock.Calendar['2020']['03']["30"],
                cityDataMock.Calendar['2020']['03']["31"],
                cityDataMock.Calendar['2020']['04']["01"]
            ]

            expect(calendar).toEqual(correctCalendar);
        });
    });

    describe('server.js - getTomorrowSchedule', () => {
        it("should export getTomorrowSchedule", () => {
            expect(service.getTomorrowSchedule).toBeTruthy();
        });

        it('should return correct schedule for tomorrow', () => {
            // March 26, 2020 - 16:00:00 GMT
            spyOn(Date, 'now').and.returnValue(new Date("2020-03-25T16:00:00.000Z"));

            expect(service.getTomorrowSchedule()).toEqual(cityDataMock.Calendar['2020']['03']["26"]);
        });
    });

    describe('server.js - getCityName', () => {
        it("should export getCityName", () => {
            expect(service.getCityName).toBeTruthy();
        });

        it('should parse the city name properly', () => {
            expect(service.getCityName()).toEqual(cityDataMock.Name);
        });
    });

    describe('server.js - getCityCode', () => {
        it("should export getCityCode", () => {
            expect(service.getCityCode).toBeTruthy();
        });

        it('should parse the city code properly', () => {
            expect(service.getCityCode()).toEqual(cityDataMock.Code);
        });
    });

    describe('server.js - getEcocentro', () => {
        it("should export getEcocentro", () => {
            expect(service.getEcocentro).toBeTruthy();
        });

        it('should parse the ecocentro info properly', () => {
            expect(service.getEcocentro()).toEqual(cityDataMock.Ecocentro);
        });
    });

    describe('server.js - getIngombranti', () => {
        it("should export getIngombranti", () => {
            expect(service.getIngombranti).toBeTruthy();
        });

        it('should parse the ingrombranti info properly', () => {
            expect(service.getIngombranti()).toEqual(cityDataMock.Ingombranti);
        });
    });

    describe('server.js - getSpeciali', () => {
        it("should export getSpeciali", () => {
            expect(service.getIngombranti).toBeTruthy();
        });

        it('should parse the speciali info properly', () => {
            expect(service.getSpeciali()).toEqual(cityDataMock.Speciali);
        });
    });

    describe('server.js - getCityData', () => {
        it("should export getCityData", () => {
            expect(service.getCityData).toBeTruthy();
        });

        it('should parse the city data info properly', () => {
            expect(service.getCityData()).toEqual(cityDataMock);
        });
    });

    describe('server.js - getCollectionInfo', () => {
        it("should export getCollectionInfo", () => {
            expect(service.getCollectionInfo).toBeTruthy();
        });

        it('should parse the collection data info properly', () => {
            const collectionInfo = service.getCollectionInfo();

            expect(collectionInfo.allowTakeOutTrashFromHour).toEqual(cityDataMock.CollectionInfo.allowTakeOutTrashFromHour);
            expect(collectionInfo.collectionStartHourOfTheDay).toEqual(cityDataMock.CollectionInfo.collectionStartHourOfTheDay);
        });
    });
});
