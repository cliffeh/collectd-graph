package net.thingly.dash.data;

import org.junit.Before;
import org.junit.Test;

public class LoadAverageServiceTest {
	// TODO push all of this into a config file somewhere
	// host-specific
	public static final String HOSTNAME = "localhost";
	public static final int PORT = 8080;

	// context-specific
	public static final String CONTEXT_PATH = "/api";
	public static final String BASE_URL = "http://" + HOSTNAME + ":" + PORT
			+ CONTEXT_PATH;

//	private WebResource r;
//	private Client c;

	/**
	 * Sets up the test fixture. (Called before every test case method.)
	 */
	@Before
	public void setUp() throws Exception {

//		// create a new Client for talking to the web service
//		ClientConfig cc = new DefaultClientConfig();
//		// cc.getClasses().add(JAXBContextResolver.class);
//		cc.getFeatures().put(JSONConfiguration.FEATURE_POJO_MAPPING,
//				Boolean.TRUE);
//		c = Client.create(cc);
//		// use the filter below to see the HTTP requests/responses
//		c.addFilter(new LoggingFilter(System.out));
//		r = c.resource(BASE_URL);
	}

	@Test
	public void getLoadAverage() {
//		ClientResponse response = r.path("/load")
//				.accept(MediaType.APPLICATION_JSON).get(ClientResponse.class);
//		assertEquals(Status.OK, response.getClientResponseStatus());
	}
}
