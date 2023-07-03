<?php
/**
 * Holds the image uploader.
 */

namespace Miiverse;

use \finfo;

/**
 * Image uploader.
 *
 * @author Repflez
 */
class Upload
{

    /**
     * Upload an image.
     *
     * @var
     *
     * @return string
     */
    public static function uploadImage(array $data) : string
    {
        $finfo = new finfo(FILEINFO_MIME_TYPE);

        $ext = array_search(
            $finfo->file($data['tmp_name']),
            array(
                'jpg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
            ),
            true
        );

        $filename = sprintf("%s.%s", sha1_file($data['tmp_name']), $ext);

        move_uploaded_file($data["tmp_name"], path("stuff/images/$filename"));

        return sprintf("%s/images/%s", config("general.image_url"), $filename);
    }

    /**
     * Upload a drawing.
     *
     * @var string
     *
     * @return string
     */
    public static function uploadDrawing(string $data) : string
    {
        return 'noop';
    }

    /**
     * Upload a Mii image.
     *
     * @var string
     *
     * @return string
     */
    public static function uploadMii(string $data) : string
    {
        // TODO: Do this in a way better way.

        // Get filename from Nintendo CDN
        $components = explode("/", $data);
        $filename = last($components);
        
        // Store avatar in server.
        file_put_contents(path("stuff/avatars/$filename"), file_get_contents($data));

        return sprintf("%s/avatars/%s", config("general.image_url"), $filename);
    }
}
