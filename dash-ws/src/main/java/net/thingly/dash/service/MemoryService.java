package net.thingly.dash.service;

import javax.ws.rs.Path;

@Path("/memory")
public class MemoryService {
	// memory-buffered.rrd memory-cached.rrd memory-free.rrd memory-used.rrd
	private String bufferedRrdLocation;
	private String cachedRrdLocation;
	private String freeRrdLocation;
	private String usedRrdLocation;

	public String getBufferedRrdLocation() {
		return bufferedRrdLocation;
	}

	public void setBufferedRrdLocation(String bufferedRrdLocation) {
		this.bufferedRrdLocation = bufferedRrdLocation;
	}

	public String getCachedRrdLocation() {
		return cachedRrdLocation;
	}

	public void setCachedRrdLocation(String cachedRrdLocation) {
		this.cachedRrdLocation = cachedRrdLocation;
	}

	public String getFreeRrdLocation() {
		return freeRrdLocation;
	}

	public void setFreeRrdLocation(String freeRrdLocation) {
		this.freeRrdLocation = freeRrdLocation;
	}

	public String getUsedRrdLocation() {
		return usedRrdLocation;
	}

	public void setUsedRrdLocation(String usedRrdLocation) {
		this.usedRrdLocation = usedRrdLocation;
	}

}
