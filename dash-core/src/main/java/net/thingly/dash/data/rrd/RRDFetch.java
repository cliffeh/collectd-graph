package net.thingly.dash.data.rrd;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class RRDFetch {

	public static final String DEFAULT_CF = "AVERAGE";
	private String filename;

	private String resolution = null;
	private String start = null;
	private String end = null;

	public RRDFetch(String filename) {
		this.filename = filename;
	}

	// TODO figure out how we're going to handle fetches from multiple files
	// (e.g., memory: buffered, cache, used, free)
	public List<RRDData> fetch() throws IOException {
		return fetch(DEFAULT_CF);
	}

	// TODO should probably throw our own kind of exception?
	public List<RRDData> fetch(String CF) throws IOException {
		// build our argument list
		List<String> args = new ArrayList<String>();
		// TODO include some way to change the path to rrdtool
		args.add("rrdtool");
		args.add("fetch");
		args.add(filename);
		args.add(CF);
		if (start != null) {
			args.add("--start");
			args.add(start);
		}
		if (end != null) {
			args.add("--end");
			args.add(end);
		}
		if (resolution != null) {
			args.add("--resolution");
			args.add(resolution);
		}

		Runtime runtime = Runtime.getRuntime();
		Process process = runtime.exec(args.toArray(new String[0]));

		// TODO check exit code
		// TODO check error stream?
		// TODO "close" the process/runtime?

		InputStream in = process.getInputStream();
		List<RRDData> data = parse(in);
		try {
			in.close();
		} catch (Exception e) {
			// silently move along if we can't close the input file
		}
		return data;
	}

	public String getEnd() {
		return end;
	}

	public String getResolution() {
		return resolution;
	}

	public String getStart() {
		return start;
	}

	private List<RRDData> parse(InputStream in) throws IOException {
		List<RRDData> list = new ArrayList<RRDData>();
		BufferedReader br = new BufferedReader(new InputStreamReader(in));

		// first line is the header; it lets us know how many fields to expect
		String line = br.readLine();
		// DEBUG
		// System.err.println("first line: " + line);

		int fields = line.trim().split("\\s+").length;
		// DEBUG
		// System.err.println("number of fields: " + fields);

		// eat the empty newline
		line = br.readLine();
		// DEBUG
		// System.err.println("this line should be empty: " + line);

		for (line = br.readLine(); line != null; line = br.readLine()) {
			line = line.trim();
			// DEBUG
			// System.err.println("the line: " + line);
			String[] pieces = line.split("[\\s:]+");
			long timestamp = Long.parseLong(pieces[0]);
			// DEBUG
			// System.err.println("timestamp: " + timestamp);
			double[] points = new double[fields];

			boolean parseError = false;
			for (int i = 0; i < fields; i++) {
				try {
					points[i] = Double.parseDouble(pieces[i + 1]);
				} catch (NumberFormatException e) {
					// if we can't parse a line, we'll just ignore it
					parseError = true;
				}
				// DEBUG
				// System.err.println("value: " + d[i]);
			}
			if (!parseError)
				list.add(new RRDData(timestamp, points));
		}

		return list;
	}

	public void setEnd(String end) {
		this.end = end;
	}

	public void setResolution(String resolution) {
		this.resolution = resolution;
	}

	public void setStart(String start) {
		this.start = start;
	}
}
