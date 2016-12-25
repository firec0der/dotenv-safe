var chai = require('chai');
var assert = chai.assert;
var dotenv = require('../index.js');
var fs = require('fs');

describe('dotenv-safe', function () {
    it('does not throw error when all is well', function () {
        assert.isOk(dotenv.load({
            sample: '.env.success'
        }));
    });

    it('does not throw error when variable exists but is empty and allowEmptyValues option is true', function () {
        assert.isOk(dotenv.load({
            sample: '.env.allowEmpty',
            allowEmptyValues: true
        }));
    });

    it('does not throw error when .env is missing but variables exist', function () {
        // mock: rename .env to .env.backup
        fs.renameSync('.env', '.env.backup');

        // mock: process.env.HELLO
        process.env.HELLO = 'WORLD';

        assert.isOk(dotenv.load({
            sample: '.env.noDotEnv'
        }));

        // reset mock: process.env.HELLO
        delete process.env.HELLO;

        // reset mock: rename .env.backup to .env
        fs.renameSync('.env.backup', '.env');
    });

    it('throws error when a variable is missing', function () {
        assert.throws(
            function () {
                dotenv.load({
                    sample: '.env.fail'
                });
                // Consider providing an Error class
            },
            /Missing environment variables/
        );
    });

    it('throws error when a variable exists but is empty and allowEmptyValues option is false', function () {
        assert.throws(
            function () {
                dotenv.load({
                    sample: '.env.allowEmpty',
                    allowEmptyValues: false
                });
                // Consider providing an Error class
            },
            /Missing environment variables/
        );
    });

    it('throws error when a variable does not exist and allowEmptyValues option is true', function () {
        assert.throws(
            function () {
                dotenv.load({
                    sample: '.env.fail',
                    allowEmptyValues: true
                });
                // Consider providing an Error class
            },
            /Missing environment variables/
        );
    });

    it('returns an object with parsed .env', function () {
        assert.deepEqual(
            { HELLO: 'world', EMPTY: '' },
            dotenv.load({
                sample: '.env.allowEmpty',
                allowEmptyValues: true
            })
        );
    });

    it('returns an object with values from process.env in case when .env does not exist', function () {
        // mock: rename .env to .env.backup
        fs.renameSync('.env', '.env.backup');

        // mock: process.env.HELLO
        process.env.HELLO = 'WORLD';

        assert.deepEqual(
            { HELLO: 'WORLD' },
            dotenv.load({
                sample: '.env.noDotEnv'
            })
        );

        assert.isOk(dotenv.load({
            sample: '.env.noDotEnv'
        }));

        // reset mock: process.env.HELLO
        delete process.env.HELLO;

        // reset mock: rename .env.backup to .env
        fs.renameSync('.env.backup', '.env');
    });
});
