<?php
/**
 * Holds the unknown server page.
 */

namespace Miiverse\Pages;

/**
 * Unknown page.
 *
 * @author Repflez
 */
class Unknown extends Page
{
	/**
	 * Serves the site index.
	 * @return string
	 */
	public function index() : string {
		http_response_code(400);
		return view('unknown');
	}
}
