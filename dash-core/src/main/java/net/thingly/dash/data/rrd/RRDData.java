package net.thingly.dash.data.rrd;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class RRDData implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -478603274674717239L;
	private long timestamp;
	private double[] points;

	public RRDData() {
	}

	public RRDData(long timestamp, double[] points) {
		this.timestamp = timestamp;
		this.points = points;
	}

	public double[] getPoints() {
		return points;
	}

	public long getTimestamp() {
		return timestamp;
	}

	public void setPoints(double[] points) {
		this.points = points;
	}

	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}

	public String toString() {
		String string = timestamp + ":";

		for (double point : points) {
			string += " " + point;
		}

		return string;
	}
}
