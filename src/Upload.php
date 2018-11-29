<?php
/**
 * Holds the image uploader.
 */

namespace Miiverse;

use Cloudinary;
use Cloudinary\Uploader;

/**
 * Image uploader.
 *
 * @author Repflez
 */
class Upload
{
    /**
     * Initialize the uploader.
     *
     * @return void
     */
    public static function init()
    {
        Cloudinary::config([
            'cloud_name' => config('cloudinary.cloud_name'),
            'api_key'    => config('cloudinary.api_key'),
            'api_secret' => config('cloudinary.api_secret'),
        ]);
    }

    /**
     * Upload an image.
     *
     * @var
     *
     * @return string
     */
    public static function uploadImage($data) : string
    {
        $upload = Cloudinary\Uploader::upload($data, [
            'upload_preset' => config('cloudinary.image_preset'),
        ]);

        return $upload['url'];
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
        $upload = Cloudinary\Uploader::upload(base64_decode($data), [
            'upload_preset' => config('cloudinary.drawings_preset'),
        ]);

        return $upload['url'];
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
        $upload = Cloudinary\Uploader::upload($data, [
            'upload_preset' => config('cloudinary.mii_preset'),
        ]);

        return $upload['url'];
    }
}
