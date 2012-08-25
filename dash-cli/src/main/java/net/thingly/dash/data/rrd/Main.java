package net.thingly.dash.data.rrd;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.cli.PosixParser;

public class Main {
	public static void main(String[] args) {

		Options options = new Options();
		options.addOption("r", "resolution", true,
				"the interval you want the values to have (seconds per value)");
		options.addOption("s", "start", true, "start of the time series");
		options.addOption("e", "end", true,
				"the end of the time series in seconds since epoch");

		if (args.length < 2) {
			HelpFormatter formatter = new HelpFormatter();
			formatter.printHelp("rrdfetch filename CF [options]", "options:",
					options, "for more information see rrdfetch(1)");
			System.exit(1);
		}

		String filename = args[0];
		RRDFetch fetch = new RRDFetch(filename);
		String CF = args[1];

		CommandLineParser parser = new PosixParser();
		try {
			CommandLine line = parser.parse(options,
					Arrays.copyOfRange(args, 2, args.length));
			if (line.hasOption('r'))
				fetch.setResolution(line.getOptionValue('r'));
			if (line.hasOption('s'))
				fetch.setStart(line.getOptionValue('s'));
			if (line.hasOption('e'))
				fetch.setEnd(line.getOptionValue('e'));
		} catch (ParseException e) {
			HelpFormatter formatter = new HelpFormatter();
			formatter.printHelp("rrdfetch filename CF [options]", "options:",
					options, "for more information see rrdfetch(1)");
			System.exit(1);
		}

		try {
			List<RRDData> list = fetch.fetch(CF);
			for (RRDData data : list) {
				System.out.println(data.toString());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
