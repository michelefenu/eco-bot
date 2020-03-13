const service = require('./service');
const cityDataMock = require('../spec/mocks/city-data-mock.json');

// TODO - Move into describes
describe("server.js: exported methods", () => {

    beforeEach(() => {
        service.setCityData(cityDataMock);
    });

    it("should export getCityData",  () => {
        expect(service.getCityData).toBeTruthy();
    });

    it("should export getCollectionInfo", () => {
        expect(service.getCollectionInfo).toBeTruthy();
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

    it("should export loadCityData", () => {
        expect(service.loadCityData).toBeTruthy();
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
});

describe('server.js: initialization', () => {
    it('should parse the mucipality data properly', () => {
        // TODO
    });
});


