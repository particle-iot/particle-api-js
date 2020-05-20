/*
 ******************************************************************************
 Copyright (c) 2016 Particle Industries, Inc.  All rights reserved.

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation, either
 version 3 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with this program; if not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************
 */

/**
 * Tests for real the Agent class using an external service.
 */

import { expect } from './test-setup';
import Agent from '../src/Agent';


describe('Agent', () => {
	if (!process.env.SKIP_AGENT_TEST){
		it('can fetch a webpage', () => {
			const agent = new Agent();
			const query = { a: '1', b: '2' };
			const result = agent.get({ uri: 'http://httpbin.org/get', query });
			return result.then((res)=> {
				expect(res.statusCode).to.equal(200);
				expect(res).has.property('body');
				expect(res.body.args).to.deep.equal(query);
			});
		});
	}
});
