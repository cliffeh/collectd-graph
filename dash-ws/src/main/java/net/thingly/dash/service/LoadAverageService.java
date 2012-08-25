package net.thingly.dash.service;

import java.io.IOException;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import net.thingly.dash.data.rrd.RRDData;
import net.thingly.dash.data.rrd.RRDFetch;

@Path("/load")
public class LoadAverageService {

	private String rrdPath;

	public String getRrdPath() {
		return rrdPath;
	}

	public void setRrdPath(String rrdPath) {
		this.rrdPath = rrdPath;
	}

	// TODO should I catch the IOException and return an appropriate code?
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<RRDData> getLoadAverage(@QueryParam("CF") String CF,
			@QueryParam("r") String r, @QueryParam("s") String s,
			@QueryParam("e") String e) throws IOException {
		RRDFetch fetch = new RRDFetch(rrdPath);

		if (CF == null)
			CF = RRDFetch.DEFAULT_CF;

		if (r != null)
			fetch.setResolution(r);
		if (s != null)
			fetch.setStart(s);
		if (e != null)
			fetch.setEnd(e);

		return fetch.fetch(CF);
	}
}
