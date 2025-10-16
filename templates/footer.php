<?php
// templates/footer.php
?>
    </div> <!-- .container -->
    <footer>
        <?php
        // Get the last modification time of the main index file
        $lastUpdated = @filemtime(__DIR__ . '/../index.php');
        if ($lastUpdated !== false) {
            echo "<p>Last updated: " . date('Y-m-d H:i:s', $lastUpdated) . "</p>";
        }
        ?>
    </footer>
    <script src="<?php echo $baseUrl; ?>js/utils.js"></script>
</body>
</html>
