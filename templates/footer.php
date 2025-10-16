<?php
// templates/footer.php
?>
    </div> <!-- .container -->
    <footer>
        <?php
        // Get the last git commit hash and date
        $commitHash = trim(shell_exec('git rev-parse --short HEAD'));
        $commitDate = trim(shell_exec('git log -1 --format=%cd --date=iso'));
        if ($commitHash && $commitDate) {
            echo "<p>Last updated: " . htmlspecialchars($commitDate) . " (rev: " . htmlspecialchars($commitHash) . ")</p>";
        }
        ?>
    </footer>
    <script src="<?php echo $baseUrl; ?>js/utils.js"></script>
</body>
</html>
