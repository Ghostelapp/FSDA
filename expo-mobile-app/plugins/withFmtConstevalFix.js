const fs = require('fs');
const path = require('path');

let withDangerousMod;
try {
  ({ withDangerousMod } = require('expo/config-plugins'));
} catch {
  ({ withDangerousMod } = require('@expo/config-plugins'));
}

/**
 * Fixes Xcode 26 / Apple Clang 17+ C++20 consteval compilation error in Pods/fmt:
 * "call to consteval function 'fmt::basic_format_string<...>' is not a constant expression"
 * by forcing FMT_USE_CONSTEVAL=0 in Pod build settings and patching fmt/core.h & fmt/base.h.
 */
module.exports = function withFmtConstevalFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) {
        return cfg;
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8');
      if (podfile.includes('FMT_USE_CONSTEVAL')) {
        return cfg;
      }

      const rubyPatch = `
    # [Xcode 26 Fix] Disable consteval in fmt C++ library for Apple Clang 17+
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        defs = build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']
        defs = [defs] if defs.is_a?(String)
        defs << 'FMT_USE_CONSTEVAL=0' unless defs.include?('FMT_USE_CONSTEVAL=0')
        build_config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = defs

        cpp_flags = build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] || ['$(inherited)']
        cpp_flags = [cpp_flags] if cpp_flags.is_a?(String)
        cpp_flags << '-DFMT_USE_CONSTEVAL=0' unless cpp_flags.include?('-DFMT_USE_CONSTEVAL=0')
        build_config.build_settings['OTHER_CPLUSPLUSFLAGS'] = cpp_flags
      end
    end

    ['Pods/fmt/include/fmt/core.h', 'Pods/fmt/include/fmt/base.h'].each do |rel_header|
      header_path = File.join(__dir__, rel_header)
      if File.exist?(header_path)
        File.chmod(0644, header_path)
        src = File.read(header_path)
        patched = src.gsub(/#define\\s+FMT_USE_CONSTEVAL\\s+1/, '#define FMT_USE_CONSTEVAL 0')
        File.write(header_path, patched) if src != patched
      end
    end
`;

      if (podfile.includes('post_install do |installer|')) {
        podfile = podfile.replace(
          'post_install do |installer|',
          `post_install do |installer|${rubyPatch}`
        );
      } else {
        podfile += `\npost_install do |installer|${rubyPatch}\nend\n`;
      }

      fs.writeFileSync(podfilePath, podfile, 'utf8');
      return cfg;
    },
  ]);
};
