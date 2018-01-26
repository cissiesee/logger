import { expect } from "chai";
import sinon from "sinon";
import { first, second, Third } from "../dist/lib";

describe("lib test", function () {
	// it("lib should be a module", function () {
	// 	expect(typeof lib).to.be.equal("object");
	// });
	// it("first promise", function () {
	// 	fetch
	// });
	it("second should return <string> test", function () {
		//console.log(lib.myMethod);
		expect(second).to.be.equal("test");
	});
	it("third should contain a=foo", function () {
		//console.log(lib.myMethod);
		expect(Third.a).to.be.equal("foo");
	});
});

describe("ajax test", function () {

	beforeEach(function () {
		this.xhr = sinon.useFakeXMLHttpRequest();

		this.requests = [];
		this.xhr.onCreate = function (xhr) {
			this.requests.push(xhr);
		}.bind(this);
	});

	afterEach(function () {
		this.xhr.restore();
	});

	// it('异步请求应该返回一个对象', function (done) {
	// 	first().then((res) => {
	// 		expect(res).to.be.an("object");
	// 		done();
	// 	}, (err) => {
	// 		expect(err).to.be.an("object");
	// 		done();
	// 	})
	// });
});

